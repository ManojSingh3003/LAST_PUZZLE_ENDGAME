import { useState, useEffect } from 'react';
import GridBoard from './components/GridBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES } from './constants';
import { saveScore, getLeaderboard } from './services/leaderboard';

export default function App() {
  // --- Core Game State & Logic ---
  const { 
    grid, playerPos, gameWon, drills, mode, switchMode, 
    uniqueSteps, par, timeElapsed 
  } = useGameLogic();

  const targetMoves = mode === GAME_MODES.NO_WALL_BREAK ? par.noBreak : par.withBreak;

  // --- UI State: Leaderboard & Scoring ---
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // --- Helper Functions ---
  const formatTime = (seconds) => (typeof seconds === 'number' ? seconds.toFixed(2) : '0.00');

  // --- Side Effects ---
  
  // Refresh leaderboard data when the modal is opened
  useEffect(() => {
    if (showLeaderboard) {
      loadLeaderboard();
    }
  }, [showLeaderboard, mode]);

  // Reset scoring UI when the game resets or mode changes
  useEffect(() => {
    setHasSaved(false);
    setUsername('');
  }, [gameWon, mode]);

  // --- Data Handlers ---

  const loadLeaderboard = async () => {
    const scores = await getLeaderboard(mode);
    setLeaderboardData(scores);
  };

  const handleSaveScore = async () => {
    if (!username.trim()) return;
    setIsSubmitting(true);
    
    // Save to Firebase
    const success = await saveScore(username, mode, uniqueSteps, timeElapsed);
    
    if (success) {
      setHasSaved(true);
      if (showLeaderboard) loadLeaderboard(); // Live refresh if modal is open
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-950 p-4">
      <h1 className="text-4xl font-bold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        LAST_PUZZLE_ENDGAME
      </h1>

      {/* --- Header Controls: Mode Switching & Leaderboard Toggle --- */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="flex gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800">
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
            Wall Break
          </button>
        </div>
        
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="px-6 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-all border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        >
          {showLeaderboard ? "Close Leaderboard" : "🏆 View Leaderboard"}
        </button>
      </div>

      {/* --- Leaderboard Overlay (Modal) --- */}
      {showLeaderboard && (
        <div className="mb-8 w-full max-w-2xl bg-gray-900/90 border border-purple-500 rounded-xl p-6 shadow-2xl backdrop-blur-sm z-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">
            🏆 Top 10 - {mode === GAME_MODES.NO_WALL_BREAK ? "No Wall Break" : "Wall Break"}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-2">Rank</th>
                  <th className="p-2">Player</th>
                  <th className="p-2 text-right">Steps</th>
                  <th className="p-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((score, index) => (
                    <tr key={score.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-2 font-bold text-gray-500">#{index + 1}</td>
                      <td className="p-2 font-bold text-white">{score.username}</td>
                      <td className="p-2 text-right text-green-400">{score.uniqueSteps}</td>
                      <td className="p-2 text-right text-yellow-400">{formatTime(score.timeElapsed)}s</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">No scores yet. Be the first!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Heads-Up Display (HUD): Stats & Resources --- */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-xl bg-gray-900/50 p-4 rounded-lg border border-gray-700 w-full max-w-2xl">
        <div className="text-gray-400 flex items-center">
          TIME: <span className="text-yellow-400 font-bold text-2xl ml-2 w-20 text-right font-mono">{formatTime(timeElapsed)}s</span>
        </div>
        <div className="text-gray-400 flex items-center">
          STEPS: 
          <span className={`font-bold text-2xl ml-2 ${uniqueSteps <= targetMoves ? 'text-green-400' : 'text-orange-400'}`}>
            {uniqueSteps}
          </span>
          <span className="text-gray-600 text-sm ml-2 self-end mb-1">/ {targetMoves} (Par)</span>
        </div>
        {mode === GAME_MODES.WALL_BREAK && (
           <div className={`transition-colors flex items-center ${drills > 0 ? 'text-blue-400' : 'text-red-500'}`}>
             DRILLS: <span className="font-bold text-2xl ml-2">{drills}</span>
           </div>
        )}
      </div>

      {/* --- Win Screen: Results & Score Submission --- */}
          {gameWon && (
            <div className="mb-6 p-6 bg-green-900/90 border border-green-500 text-green-100 rounded-xl text-center shadow-2xl animate-float">
             <div className="text-3xl font-bold mb-4">LEVEL COMPLETED!</div>
             
             {/* Final Stats */}
             <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left bg-black/30 p-4 rounded-lg mb-4">
               <div className="text-gray-300">Path Efficiency:</div>
               <div className="font-bold text-right">
                 {uniqueSteps <= targetMoves ? "✅ Perfect Run 🏆" : `❌ +${uniqueSteps - targetMoves} Steps`}
               </div>
               <div className="text-gray-300">Completion Time:</div>
               <div className="font-bold text-right text-yellow-300">{formatTime(timeElapsed)}s</div>
             </div>

             {/* Save Score Input */}
             {!hasSaved ? (
               <div className="flex gap-2 justify-center mt-4">
                 <input 
                   type="text" 
                   placeholder="Enter Name" 
                   maxLength="20"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="px-3 py-2 rounded text-black font-bold outline-none border-2 border-transparent focus:border-yellow-400"
                 />
                 <button 
                   onClick={handleSaveScore}
                   disabled={isSubmitting || !username}
                   className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded disabled:opacity-50 transition-colors"
                 >
                   {isSubmitting ? "Saving..." : "Save Score"}
                 </button>
               </div>
             ) : (
               <div className="text-yellow-300 font-bold mt-4 animate-pulse">
                 ✅ Score Saved to Leaderboard!
               </div>
             )}
        </div>
      )}

      {/* --- Main Game Board --- */}
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