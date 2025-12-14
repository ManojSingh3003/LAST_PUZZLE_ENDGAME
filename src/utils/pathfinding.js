import { GRID_SIZE, CELL_TYPES } from '../constants';

// Dedicated function to solve the maze for a specific drill limit
const solveLevelBFS = (grid, maxDrillsAllowed) => {
  const startPos = grid.indexOf(CELL_TYPES.START);
  const goalPos = grid.indexOf(CELL_TYPES.GOAL);

  if (startPos === -1 || goalPos === -1) return Infinity;

  // Queue stores: { pos, steps, drillsUsed }
  const queue = [{ pos: startPos, steps: 0, drillsUsed: 0 }];
  
  // Visited set keys: "position-drillsUsed"
  const visited = new Set();
  visited.add(`${startPos}-0`);

  while (queue.length > 0) {
    const { pos, steps, drillsUsed } = queue.shift();

    if (pos === goalPos) return steps; 

    // --- 1. Process Teleportation (Zero-Step) ---
    const currentCell = grid[pos];
    if (currentCell >= CELL_TYPES.PORTAL_A && currentCell <= CELL_TYPES.PORTAL_E) {
      
      let dest = -1;
      grid.forEach((cell, index) => {
        if (cell === currentCell && index !== pos) {
          dest = index;
        }
      });

      if (dest !== -1) {
        const key = `${dest}-${drillsUsed}`;
        if (!visited.has(key)) {
          visited.add(key);
          // Teleport is instant: steps and drillsUsed remain the same
          queue.push({ pos: dest, steps: steps, drillsUsed: drillsUsed });
        }
      }
    }

    // --- 2. Process Standard Moves (One-Step) ---
    const neighbors = [];
    const row = Math.floor(pos / GRID_SIZE);
    const col = pos % GRID_SIZE;

    if (row > 0) neighbors.push(pos - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(pos + GRID_SIZE);
    if (col > 0) neighbors.push(pos - 1);
    if (col < GRID_SIZE - 1) neighbors.push(pos + 1);
    
    for (const next of neighbors) {
      const nextType = grid[next];
      let newDrillsUsed = drillsUsed;
      let canMove = true;

      if (nextType === CELL_TYPES.WALL) {
        // If it's a wall, check if we are allowed to drill it
        if (drillsUsed < maxDrillsAllowed) {
          newDrillsUsed = drillsUsed + 1;
        } else {
          canMove = false; // Cannot drill, so cannot move through the wall
        }
      } 

      if (canMove) {
        const key = `${next}-${newDrillsUsed}`;
        
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ 
            pos: next, 
            steps: steps + 1,
            drillsUsed: newDrillsUsed
          });
        }
      }
    }
  }

  return Infinity;
};


export function calculateLevelPar(grid, maxDrills) {
  
  // 1. Calculate No Break Path (Max Drills allowed = 0)
  const minStepsNoBreak = solveLevelBFS(grid, 0);

  // 2. Calculate With Break Path (Max Drills allowed = maxDrills)
  const minStepsWithBreak = solveLevelBFS(grid, maxDrills);

  return { 
    minStepsNoBreak: minStepsNoBreak, 
    minStepsWithBreak: minStepsWithBreak 
  };
}