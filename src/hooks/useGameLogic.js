import { useState, useEffect } from 'react';
import { GRID_SIZE, CELL_TYPES } from '../constants';

export function useGameLogic() {
  const [playerPos, setPlayerPos] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const [drills,setDrills]=useState(1);

  const [grid,setGrid] = useState(() => {
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(CELL_TYPES.EMPTY);
    

    newGrid[0] = CELL_TYPES.START;
    newGrid[1] = CELL_TYPES.WALL;        // wall right
    newGrid[21] = CELL_TYPES.WALL;       // wall below
    newGrid[50] = CELL_TYPES.PORTAL_A;   // red1 portal
    newGrid[150] = CELL_TYPES.PORTAL_A;  // red2 portal
    newGrid[250] = CELL_TYPES.PORTAL_B;  // blue1 portal
    newGrid[100] = CELL_TYPES.PORTAL_B;  // blue2 portal
    newGrid[399] = CELL_TYPES.GOAL;      // yellow goal
    
    return newGrid;
  });

  useEffect(() => {
    if (gameWon) return;

    const handleKeyDown = (e) => {
      
      // --- Teleport Logic ---
      if (e.key === 'Enter') {
        setPlayerPos((curr) => {
          const currentCell = grid[curr];

          if (currentCell === CELL_TYPES.PORTAL_A) {
            return curr === 50 ? 150 : 50;
          }

          if (currentCell === CELL_TYPES.PORTAL_B) {
            return curr === 100 ? 250 : 100;
          }

          return curr;
        });
        return; 
      }

      // --- Movement Logic ---
      const isShiftHeld=e.shiftKey;

      setPlayerPos((curr) => {
        let next = curr;
        const row = Math.floor(curr / GRID_SIZE);
        const col = curr % GRID_SIZE;

        if (e.key === 'ArrowUp' && row > 0) next -= GRID_SIZE;
        if (e.key === 'ArrowDown' && row < GRID_SIZE - 1) next += GRID_SIZE;
        if (e.key === 'ArrowLeft' && col > 0) next -= 1;
        if (e.key === 'ArrowRight' && col < GRID_SIZE - 1) next += 1;

        const nextCell = grid[next];
        // 1. Walls block you
        if (nextCell === CELL_TYPES.WALL) {
          if(isShiftHeld){
            if(drills>0){
              setGrid((prevGrid) => {
                const newGrid = [...prevGrid]; 
                newGrid[next] = CELL_TYPES.EMPTY;
                return newGrid;
              });
              setDrills((d)=>d-1);
              return next;
            }else{
              return curr;
            }
          }else{
            return curr;
          }
        }
        // 2. Portals allow you to STAND on them (No auto-teleport)
        if (nextCell === CELL_TYPES.PORTAL_A || nextCell === CELL_TYPES.PORTAL_B) {
            return next; 
        }
        // 3. Win Condition
        if (nextCell === CELL_TYPES.GOAL) setGameWon(true);

        return next;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameWon]);

  return { grid, playerPos, gameWon ,drills};
}