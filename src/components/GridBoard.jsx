import { CELL_TYPES, GRID_SIZE } from '../constants';
import { twMerge } from 'tailwind-merge';

export default function GridBoard({ grid, playerPos }) {
  const getCellColor = (type) => {
    switch (type) {
      case CELL_TYPES.WALL: return 'bg-gray-700 border-gray-600 shadow-inner';
      case CELL_TYPES.START: return 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]';
      case CELL_TYPES.GOAL: return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse';
      case CELL_TYPES.PORTAL_A: return 'bg-orange-500 border-orange-700';
      case CELL_TYPES.PORTAL_B: return 'bg-purple-500 border-purple-700';
      case CELL_TYPES.PORTAL_C: return 'bg-cyan-500 border-cyan-700';
      case CELL_TYPES.PORTAL_D: return 'bg-emerald-600 border-emerald-800';
      case CELL_TYPES.PORTAL_E: return 'bg-rose-500 border-rose-700';
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
              "w-full h-full rounded-sm flex items-center justify-center transition-colors duration-100 relative",
              getCellColor(cellType)
            )}
          >
            {isPlayerHere && (
              <div className="w-[70%] h-[70%] bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7] border border-white z-10" />
            )}
             {/* Show Letter on Portals (A, B, C...) */}
             {(cellType >= CELL_TYPES.PORTAL_A && cellType <= CELL_TYPES.PORTAL_E) && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs opacity-50 pointer-events-none">
                {String.fromCharCode(65 + (cellType - CELL_TYPES.PORTAL_A))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}