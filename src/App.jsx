import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  
  const { grid, playerPos, gameWon, drills } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-950 p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        LAST_PUZZLE_ENDGAME
      </h1>
      
      {/* --- NEW FEATURE: DRILL COUNTER --- */}
      <div className="mb-6 flex gap-4">
        <div className={`
          px-6 py-2 rounded-lg font-mono text-lg font-bold border transition-all duration-300
          ${drills > 0 
            ? 'bg-blue-900/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
            : 'bg-red-900/30 border-red-500 text-red-500 opacity-50'}
        `}>
          WALL STRIKES LEFT: <span className="text-2xl ml-2">{drills}</span>
        </div>
      </div>
      {/* ---------------------------------- */}

      {gameWon && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-2xl font-bold animate-bounce">
             LEVEL COMPLETED! 
        </div>
      )}

      <GridBoard grid={grid} playerPos={playerPos} />
      
      <p className="mt-6 text-gray-500 font-mono text-sm text-center">
        Use <span className="text-white font-bold">Arrow Keys</span> to move <br/>
        Hold <span className="text-blue-400 font-bold">Shift</span> + Arrow to drill walls
      </p>
    </div>
  );
}