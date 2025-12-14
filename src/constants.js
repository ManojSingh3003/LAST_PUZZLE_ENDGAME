export const GRID_SIZE = 8;

export const MAX_DRILLS = 2;
export const GAME_MODES = {
  NO_WALL_BREAK: 'no-wall-break',
  WALL_BREAK: 'wall-break',
};
export const CELL_TYPES = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  GOAL: 3,
  PORTAL_A: 4, // Red
  PORTAL_B: 5, // Blue
};

export const PORTAL_PAIRS = {
  // Red Portals
  47: 58,
  58: 47,
  // Blue Portals
  7: 34,
  34: 7
};