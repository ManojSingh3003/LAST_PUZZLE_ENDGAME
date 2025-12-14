import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES } from './constants';

export default function App() {
  const { grid, playerPos, gameWon, drills, mode, switchMode,timeElapsed,par,moves } = useGameLogic();
  const targetMoves = mode === GAME_MODES.NO_WALL_BREAK ? par.noBreak : par.withBreak;

  const formatTime = (seconds) => {
  return typeof seconds === 'number' ? seconds.toFixed(2) : '0.00';
};

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
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-xl bg-gray-900/50 p-4 rounded-lg border border-gray-700 w-full max-w-2xl">
        {/* NEW: TIMER Display */}
        <div className="text-gray-400 flex items-center">
          TIME: <span className="text-yellow-400 font-bold text-2xl ml-2 w-20 text-right font-mono">
            {formatTime(timeElapsed)}s
          </span>
        </div>
        
        <div className="text-gray-400 flex items-center">
          STEPS: 
          <span className={`font-bold text-2xl ml-2 ${moves <= targetMoves ? 'text-green-400' : 'text-orange-400'}`}>
            {moves}
          </span>
          <span className="text-gray-600 text-sm ml-2 self-end mb-1">
             / {targetMoves} (Par)
          </span>
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
        <div className="mb-6 p-6 bg-green-900/90 border border-green-500 text-green-100 rounded-xl text-center shadow-2xl animate-bounce">
             <div className="text-3xl font-bold mb-4">LEVEL COMPLETED!</div>
             
             {/* Stats Grid for Leaderboard Logic */}
             <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left bg-black/30 p-4 rounded-lg">
               <div className="text-gray-300">Path Efficiency:</div>
               <div className="font-bold text-right">
                 {moves <= targetMoves 
                   ? "✅ Perfect Run 🏆 " 
                   : `❌ +${moves - targetMoves} Steps`}
               </div>
               
               <div className="text-gray-300">Completion Time:</div>
               <div className="font-bold text-right text-yellow-300">
                 {formatTime(timeElapsed)}s
               </div>
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