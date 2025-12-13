import { CELL_TYPES, GRID_SIZE } from '../constants';
import { twMerge } from 'tailwind-merge';

export default function GridBoard({ grid, playerPos }) {
  const getCellColor = (type) => {
    switch (type) {
      case CELL_TYPES.WALL: return 'bg-gray-800 border-gray-900';
      case CELL_TYPES.START: return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
      case CELL_TYPES.GOAL: return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]';
      case CELL_TYPES.PORTAL_A: return 'bg-red-600 animate-pulse';
      case CELL_TYPES.PORTAL_B: return 'bg-cyan-500 animate-pulse';
      default: return 'bg-gray-900/50 border-gray-800'; 
    }
  };

  return (
    <div 
      className="grid gap-0.5 bg-gray-900 p-2 rounded-lg border border-gray-700 shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        width: 'min(90vw, 600px)',
        aspectRatio: '1/1',
      }}
    >
      {grid.map((cellType, index) => {
        const isPlayerHere = playerPos === index;
        return (
          <div 
            key={index}
            className={twMerge(
              "w-full h-full rounded-sm flex items-center justify-center transition-colors duration-100",
              getCellColor(cellType)
            )}
          >
            {isPlayerHere && (
              <div className="w-[70%] h-[70%] bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7] border border-white z-10" />
            )}
          </div>
        );
      })}
    </div>
  );
}