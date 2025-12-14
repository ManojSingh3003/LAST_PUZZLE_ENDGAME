import { GRID_SIZE, CELL_TYPES } from '../constants';

export function calculateLevelPar(grid, maxDrills) {
  const startPos = grid.indexOf(CELL_TYPES.START);
  const goalPos = grid.indexOf(CELL_TYPES.GOAL);

  const queue = [{ pos: startPos, drills: 0, steps: 0 }];
  
  const visited = new Set();
  visited.add(`${startPos}-0`);

  let minStepsNoBreak = -1; 
  let minStepsWithBreak = -1;

  while (queue.length > 0) {
    const { pos, drills, steps } = queue.shift();

    if (pos === goalPos) {
      if (drills === 0 && minStepsNoBreak === -1) {
        minStepsNoBreak = steps;
      }
      if (minStepsWithBreak === -1) {
        minStepsWithBreak = steps;
      }
      if (minStepsNoBreak !== -1 && minStepsWithBreak !== -1) break;
    }

    const neighbors = [];
    const row = Math.floor(pos / GRID_SIZE);
    const col = pos % GRID_SIZE;

    // Standard Moves
    if (row > 0) neighbors.push(pos - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) neighbors.push(pos + GRID_SIZE); // Down
    if (col > 0) neighbors.push(pos - 1); // Left
    if (col < GRID_SIZE - 1) neighbors.push(pos + 1); // Right
    

    const currentCell = grid[pos];
    if (currentCell >= CELL_TYPES.PORTAL_A && currentCell <= CELL_TYPES.PORTAL_E) {
     
      grid.forEach((cell, index) => {
        if (cell === currentCell && index !== pos) {
          neighbors.push(index);
        }
      });
    }

    for (const next of neighbors) {
      const isWall = grid[next] === CELL_TYPES.WALL;

      const drillsNeeded = isWall ? drills + 1 : drills;

      if (drillsNeeded <= maxDrills) {
        // We track state as "position-drillsUsed"
        const key = `${next}-${drillsNeeded}`;
        
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ 
            pos: next, 
            drills: drillsNeeded, 
            steps: steps + 1 
          });
        }
      }
    }
  }

  
  return { 
    minStepsNoBreak: minStepsNoBreak === -1 ? Infinity : minStepsNoBreak, 
    minStepsWithBreak: minStepsWithBreak === -1 ? Infinity : minStepsWithBreak 
  };
}