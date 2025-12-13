import { useState, useEffect } from 'react';
import { GRID_SIZE, CELL_TYPES } from '../constants';

export function useGameLogic() {
  const [playerPos, setPlayerPos] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // FIX: Initialize the grid IMMEDIATELY (Synchronously)
  const [grid] = useState(() => {
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(CELL_TYPES.EMPTY);
    
    // --- MAP SETUP ---
    newGrid[0] = CELL_TYPES.START;
    newGrid[1] = CELL_TYPES.WALL;       // Wall to the right
    newGrid[21] = CELL_TYPES.WALL;      // Wall below
    newGrid[50] = CELL_TYPES.PORTAL_A;  // Red Portal
    newGrid[150] = CELL_TYPES.PORTAL_B; // Blue Portal
    newGrid[399] = CELL_TYPES.GOAL;     // Yellow Goal
    
    return newGrid;
  });

  // Movement Logic
  useEffect(() => {
    if (gameWon) return;

    const handleKeyDown = (e) => {
      setPlayerPos((curr) => {
        let next = curr;
        const row = Math.floor(curr / GRID_SIZE);
        const col = curr % GRID_SIZE;

        if (e.key === 'ArrowUp' && row > 0) next -= GRID_SIZE;
        if (e.key === 'ArrowDown' && row < GRID_SIZE - 1) next += GRID_SIZE;
        if (e.key === 'ArrowLeft' && col > 0) next -= 1;
        if (e.key === 'ArrowRight' && col < GRID_SIZE - 1) next += 1;

        // Collision Check
        if (grid[next] !== CELL_TYPES.WALL) {
            if (grid[next] === CELL_TYPES.GOAL) setGameWon(true);
            return next;
        }
        return curr;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameWon]);

  return { grid, playerPos, gameWon };
}