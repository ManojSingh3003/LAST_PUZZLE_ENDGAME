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
  
  // --- Grid State ---
  // We store 'originalGrid' to keep a clean copy of the map (with walls intact)
  const [originalGrid, setOriginalGrid] = useState(createInitialGrid);
  const [grid, setGrid] = useState(createInitialGrid);

  const [levelMaxDrills, setLevelMaxDrills] = useState(MAX_DRILLS);
  const [drills, setDrills] = useState(MAX_DRILLS);
  const [visitedCells, setVisitedCells] = useState(new Set([0])); 
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [par, setPar] = useState({ noBreak: 0, withBreak: 0 });

  const timerRef = useRef(null);

  // --- Switch Mode (Resets Game) ---
  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setGameWon(false);
    
    // RESTORE GRID: Reset broken walls using the original clean copy
    setGrid([...originalGrid]);

    const startIdx = originalGrid.indexOf(CELL_TYPES.START);
    const safeStart = startIdx !== -1 ? startIdx : 0;
    
    setPlayerPos(safeStart);
    setTimeElapsed(0);
    setStartTime(null);
    setVisitedCells(new Set([safeStart]));
    
    if (timerRef.current) clearInterval(timerRef.current);

    if (newMode === GAME_MODES.NO_WALL_BREAK) {
      setDrills(0);
    } else {
      setDrills(levelMaxDrills); 
    }
  }, [originalGrid, levelMaxDrills]);

  // --- Initial Calculation ---
  useEffect(() => {
    const scores = calculateLevelPar(originalGrid, MAX_DRILLS);
    setPar({ 
      noBreak: scores.minStepsNoBreak, 
      withBreak: scores.minStepsWithBreak 
    });
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (startTime && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, gameWon]);

  // --- Input Handling ---
  useEffect(() => {
    if (gameWon) {
      clearInterval(timerRef.current);
        return;
    }

    const handleKeyDown = (e) => {
      if (!startTime) setStartTime(Date.now());
      
      // --- Teleport Logic ---
      if (e.key === 'Enter') {
        const currentCell = grid[playerPos];
        let dest = -1;

        if (currentCell === CELL_TYPES.PORTAL_A) {
           const allAs = grid.map((c, i) => c === CELL_TYPES.PORTAL_A ? i : -1).filter(i => i !== -1);
           dest = allAs.find(i => i !== playerPos);
        } else if (currentCell === CELL_TYPES.PORTAL_B) {
           const allBs = grid.map((c, i) => c === CELL_TYPES.PORTAL_B ? i : -1).filter(i => i !== -1);
           dest = allBs.find(i => i !== playerPos);
        }

        if (dest !== undefined && dest !== -1) {
           setPlayerPos(dest);
           setVisitedCells(prev => new Set(prev).add(dest));
        }
        return; 
      }

      // --- Movement Logic ---
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

      // Wall Logic
      if (nextCell === CELL_TYPES.WALL) {
        if (isShiftHeld && drills > 0) {
           setGrid(g => {
             const ng = [...g]; ng[next] = CELL_TYPES.EMPTY; return ng;
           });
           setDrills(d => d - 1);
           setPlayerPos(next);
           moved = true;
        }
      } 
      // Normal Move
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
  }, [grid, gameWon, drills, playerPos, startTime]);


  // --- Load Level Function ---
  const loadLevel = useCallback((newGridData, newKValue, initialMode) => {
    // Save Clean Copy AND Active Copy
    setOriginalGrid(newGridData);
    setGrid([...newGridData]); 
    
    // Find start dynamically
    const startIdx = newGridData.indexOf(CELL_TYPES.START);
    const safeStart = startIdx !== -1 ? startIdx : 0;

    setPlayerPos(safeStart);
    setGameWon(false);
    setTimeElapsed(0);
    setStartTime(null);
    setVisitedCells(new Set([safeStart]));
    if (timerRef.current) clearInterval(timerRef.current);

    // Update K 
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


  return { 
    grid, playerPos, gameWon, drills, mode, switchMode, 
    uniqueSteps: visitedCells.size - 1, par, timeElapsed, loadLevel 
  };
}