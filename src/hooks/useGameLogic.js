import { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, CELL_TYPES, GAME_MODES, MAX_DRILLS } from '../constants';
import { calculateLevelPar } from '../utils/pathfinding';

const createInitialGrid = () => {
  const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(CELL_TYPES.EMPTY);

  newGrid[0] = CELL_TYPES.START;
  newGrid[63] = CELL_TYPES.GOAL;

  newGrid[7] = CELL_TYPES.PORTAL_B;
  newGrid[34] = CELL_TYPES.PORTAL_B;
  newGrid[58] = CELL_TYPES.PORTAL_A;
  newGrid[47] = CELL_TYPES.PORTAL_A;

  const walls = [
    1, 5, 9, 11, 15, 19, 21, 22, 23, 25, 26, 27, 28,
    32, 33, 35, 37, 43, 46, 49, 50, 51, 52, 53, 54, 59
  ];

  walls.forEach(index => {
    newGrid[index] = CELL_TYPES.WALL;
  });

  return newGrid;
};

export function useGameLogic() {
  const [mode, setMode] = useState(GAME_MODES.WALL_BREAK);
  const [playerPos, setPlayerPos] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  
  const [currentLevelId, setCurrentLevelId] = useState('default');

  const [originalGrid, setOriginalGrid] = useState(createInitialGrid);
  const [grid, setGrid] = useState(createInitialGrid);

  const [levelMaxDrills, setLevelMaxDrills] = useState(MAX_DRILLS);
  const [drills, setDrills] = useState(MAX_DRILLS);
  const [visitedCells, setVisitedCells] = useState(new Set([0])); 
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [par, setPar] = useState({ noBreak: 0, withBreak: 0 });

  // For Wall Break Flash Feedback
  const [lastDrilledPos, setLastDrilledPos] = useState(null); 

  const timerRef = useRef(null);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setGameWon(false);
    
    setGrid([...originalGrid]);

    const startIdx = originalGrid.indexOf(CELL_TYPES.START);
    const safeStart = startIdx !== -1 ? startIdx : 0;
    
    setPlayerPos(safeStart);
    setTimeElapsed(0);
    setStartTime(null);
    setVisitedCells(new Set([safeStart]));
    
    if (timerRef.current) clearInterval(timerRef.current);
    setLastDrilledPos(null); 

    if (newMode === GAME_MODES.NO_WALL_BREAK) {
      setDrills(0);
    } else {
      setDrills(levelMaxDrills); 
    }
  }, [originalGrid, levelMaxDrills]);

  useEffect(() => {
    const scores = calculateLevelPar(originalGrid, MAX_DRILLS);
    setPar({ 
      noBreak: scores.minStepsNoBreak, 
      withBreak: scores.minStepsWithBreak 
    });
  }, []);

  useEffect(() => {
    if (startTime && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, gameWon]);

  useEffect(() => {
    if (gameWon) {
      clearInterval(timerRef.current);
        return;
    }

    const handleKeyDown = (e) => {
      if (!startTime) setStartTime(Date.now());
      
      if (e.key === 'Enter') {
        const currentCell = grid[playerPos];
        
        if (currentCell >= CELL_TYPES.PORTAL_A && currentCell <= CELL_TYPES.PORTAL_E) {

           const matchingPortals = grid
              .map((c, i) => c === currentCell ? i : -1)
              .filter(i => i !== -1);
           
           const dest = matchingPortals.find(i => i !== playerPos);

           if (dest !== undefined) {
              setPlayerPos(dest);
              setVisitedCells(prev => new Set(prev).add(dest));
           }
        }
        return; 
      }

      const isShiftHeld = e.shiftKey;
      let next = playerPos;
      const row = Math.floor(playerPos / GRID_SIZE);
      const col = playerPos % GRID_SIZE;

      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && row > 0) next -= GRID_SIZE;
      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && row < GRID_SIZE - 1) next += GRID_SIZE;
      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && col > 0) next -= 1;
      if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && col < GRID_SIZE - 1) next += 1;

      if (next === playerPos) return; 

      const nextCell = grid[next];
      let moved = false;

      if (nextCell === CELL_TYPES.WALL) {
        if (isShiftHeld && drills > 0 && mode === GAME_MODES.WALL_BREAK) {
           setGrid(g => {
             const ng = [...g]; 
               ng[next] = CELL_TYPES.EMPTY; 
               return ng;
           });
           setDrills(d => d - 1);
           setPlayerPos(next);
           moved = true;

            // --- Wall Break Flash Logic ---
            setLastDrilledPos(next);
            setTimeout(() => setLastDrilledPos(null), 100); 

        }
      } 
      else {
         setPlayerPos(next);
         moved = true;
      }

      if (moved) {
        setVisitedCells(prev => new Set(prev).add(next));
        if (grid[next] === CELL_TYPES.GOAL || nextCell === CELL_TYPES.GOAL) {
             setGameWon(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameWon, drills, playerPos, startTime, mode]); // Added mode to dependencies


  const loadLevel = useCallback((newGridData, newKValue, initialMode, newLevelId) => {
    setCurrentLevelId(newLevelId || 'default');

    setOriginalGrid(newGridData);
    setGrid([...newGridData]); 
    
    const startIdx = newGridData.indexOf(CELL_TYPES.START);
    const safeStart = startIdx !== -1 ? startIdx : 0;

    setPlayerPos(safeStart);
    setGameWon(false);
    setTimeElapsed(0);
    setStartTime(null);
    setVisitedCells(new Set([safeStart]));
    if (timerRef.current) clearInterval(timerRef.current);
    setLastDrilledPos(null); // Clear any active flash

    const k = parseInt(newKValue) || 0;
    setLevelMaxDrills(k); 

    const targetMode = initialMode || mode;
    setMode(targetMode);
    
    setDrills(targetMode === GAME_MODES.NO_WALL_BREAK ? 0 : k);

    const scores = calculateLevelPar(newGridData, k);
    setPar({ 
      noBreak: scores.minStepsNoBreak, 
      withBreak: scores.minStepsWithBreak 
    });
  }, [mode]);

  const loadClassicLevel = useCallback(() => {
    const classicGrid = createInitialGrid();
    loadLevel(classicGrid, MAX_DRILLS, GAME_MODES.WALL_BREAK, 'default');
  }, [loadLevel]);

  return { 
    grid, playerPos, gameWon, drills, mode, switchMode, 
    uniqueSteps: visitedCells.size - 1, par, timeElapsed, 
    loadLevel, loadClassicLevel, currentLevelId,
    lastDrilledPos 
  };
}