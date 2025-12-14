import { useState, useEffect ,useCallback} from 'react';
import { GRID_SIZE, CELL_TYPES ,GAME_MODES,MAX_DRILLS,PORTAL_PAIRS} from '../constants';
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
  const [grid, setGrid] = useState(createInitialGrid);
  const [drills,setDrills]=useState(MAX_DRILLS);
  const [moves, setMoves] = useState(0);
  const [par, setPar] = useState({ noBreak: 0, withBreak: 0 });

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setGameWon(false);
    setPlayerPos(0);
    setMoves(0);

    const newGrid = createInitialGrid();
    setGrid(newGrid);

    const scores = calculateLevelPar(newGrid, MAX_DRILLS);
    setPar({ 
      noBreak: scores.minStepsNoBreak, 
      withBreak: scores.minStepsWithBreak 
    });
    
    if (newMode === GAME_MODES.NO_WALL_BREAK) {
      setDrills(0);
    } else {
      setDrills(MAX_DRILLS);
    }
  }, []);

  useEffect(() => {
    const scores = calculateLevelPar(grid, MAX_DRILLS);
    setPar({ 
      noBreak: scores.minStepsNoBreak, 
      withBreak: scores.minStepsWithBreak 
    });
  }, []);

  useEffect(() => {
    if (gameWon) return;

    const handleKeyDown = (e) => {
      // --- Teleport Logic ---
      if (e.key === 'Enter') {
        if (PORTAL_PAIRS[playerPos] !== undefined) {
           setPlayerPos(PORTAL_PAIRS[playerPos]);
           setMoves(m => m + 1);
        }
        return; 
      }

      // --- Movement Logic ---
      const isShiftHeld = e.shiftKey;
      
      let next = playerPos;
      const row = Math.floor(playerPos / GRID_SIZE);
      const col = playerPos % GRID_SIZE;

      if (e.key === 'ArrowUp' && row > 0) next -= GRID_SIZE;
      if (e.key === 'ArrowDown' && row < GRID_SIZE - 1) next += GRID_SIZE;
      if (e.key === 'ArrowLeft' && col > 0) next -= 1;
      if (e.key === 'ArrowRight' && col < GRID_SIZE - 1) next += 1;

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
        setMoves(m => m + 1);
        if (grid[next] === CELL_TYPES.GOAL || nextCell === CELL_TYPES.GOAL) {
             setGameWon(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameWon, drills, playerPos]);

  // 5. FIX: Export 'moves' and 'par' so App.jsx can see them
  return { grid, playerPos, gameWon, drills, mode, switchMode, moves, par };
}