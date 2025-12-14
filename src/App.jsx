import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES } from './constants';

export default function App() {
  const { grid, playerPos, gameWon, drills, mode, switchMode,moves,par } = useGameLogic();
  const targetMoves = mode === GAME_MODES.NO_WALL_BREAK ? par.noBreak : par.withBreak;

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

      {/* --- DRILL HUD --- */}
      <div className="flex gap-8 mb-6 text-xl bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <div className="text-gray-400">
          MOVES: <span className="text-white font-bold text-2xl ml-2">{moves}</span>
        </div>
        <div className="text-gray-400">
          TARGET: <span className="text-green-400 font-bold text-2xl ml-2">{targetMoves}</span>
        </div>
        
        {/*show Drills if in Wall Break Mode */}
        {mode === GAME_MODES.WALL_BREAK && (
           <div className={`transition-colors ${drills > 0 ? 'text-blue-400' : 'text-red-500'}`}>
             DRILLS: <span className="font-bold text-2xl ml-2">{drills}</span>
           </div>
        )}
      </div>

      {/* --- 4.WIN MESSAGE (Checks for perfect run) --- */}
      {gameWon && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-center animate-bounce">
             <div className="text-2xl font-bold">LEVEL COMPLETED!</div>
             <div className="text-white mt-2">
               {moves <= targetMoves ? "PERFECT RUN!🏆" : "Can you do it faster?"}
             </div>
        </div>
      )}

      <GridBoard grid={grid} playerPos={playerPos} />
      
      <p className="mt-6 text-gray-500 text-sm text-center">
        Use <span className="text-white font-bold">Arrow Keys</span> to move <br/>
        {mode === GAME_MODES.WALL_BREAK 
          ? <span>Hold <span className="text-blue-400 font-bold">Shift</span> + Arrow to drill</span>
          : <span className="text-red-400">Wall breaking disabled</span>
        }
      </p>
    </div>
  );
}