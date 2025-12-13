import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES } from './constants';

export default function App() {
  const { grid, playerPos, gameWon, drills, mode, switchMode } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-950 p-4">
      <h1 className="text-4xl font-bold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        LAST_PUZZLE_ENDGAME
      </h1>

      {/* --- GAME MODE SELECTOR --- */}
      <div className="flex gap-4 mb-6 bg-gray-900 p-2 rounded-xl border border-gray-800">
        <button
          onClick={() => switchMode(GAME_MODES.NO_WALL_BREAK)}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            mode === GAME_MODES.NO_WALL_BREAK 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          No Wall Break
        </button>
        <button
          onClick={() => switchMode(GAME_MODES.WALL_BREAK)}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            mode === GAME_MODES.WALL_BREAK 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Wall Break Mode
        </button>
      </div>

      {/* --- DRILL HUD (Only show if drills are allowed) --- */}
      {mode === GAME_MODES.WALL_BREAK && (
        <div className="mb-6 flex gap-4">
          <div className={`
            px-6 py-2 rounded-lg font-mono text-lg font-bold border transition-all duration-300
            ${drills > 0 
              ? 'bg-blue-900/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
              : 'bg-red-900/30 border-red-500 text-red-500 opacity-50'}
          `}>
            DRILLS LEFT: <span className="text-2xl ml-2">{drills}</span>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-2xl font-bold animate-bounce">
             LEVEL COMPLETED! 
        </div>
      )}

      <GridBoard grid={grid} playerPos={playerPos} />
      
      <p className="mt-6 text-gray-500 font-mono text-sm text-center">
        Use <span className="text-white font-bold">Arrow Keys</span> to move <br/>
        {mode === GAME_MODES.WALL_BREAK 
          ? <span>Hold <span className="text-blue-400 font-bold">Shift</span> + Arrow to drill walls</span>
          : <span className="text-red-400">Wall breaking is disabled in this mode</span>
        }
      </p>
    </div>
  );
}