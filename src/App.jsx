import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const { grid, playerPos, gameWon } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-950 p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        LAST_PUZZLE_ENDGAME
      </h1>
      
      {gameWon && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-2xl font-bold animate-bounce">
             LEVEL COMPLETED! 
        </div>
      )}

      <GridBoard grid={grid} playerPos={playerPos} />
      
      <p className="mt-6 text-gray-500 font-mono text-sm">
        Use <span className="text-white font-bold">Arrow Keys</span> to move
      </p>
    </div>
  );
}