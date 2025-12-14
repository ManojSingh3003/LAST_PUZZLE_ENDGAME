import { useState, useEffect } from 'react';
import GridBoard from './components/GridBoard';
import LevelEditor from './components/LevelEditor';
import LevelBrowser from './components/LevelBrowser';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES } from './constants';
import { saveScore, getLeaderboard } from './services/leaderboard';

// View States
const VIEWS = {
  MENU: 'MENU',
  GAME: 'GAME',
  EDITOR: 'EDITOR',
  BROWSER: 'BROWSER'
};

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS.MENU);
  
  // Hooks
  const { 
    grid, playerPos, gameWon, drills, mode, switchMode, 
    uniqueSteps, par, timeElapsed, loadLevel // You need to expose loadLevel in hook (see Step 3)
  } = useGameLogic();

  // Leaderboard State
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const targetMoves = mode === GAME_MODES.NO_WALL_BREAK ? par.noBreak : par.withBreak;
  const formatTime = (s) => (typeof s === 'number' ? s.toFixed(2) : '0.00');

  // --- Handlers ---

  const handleStartGame = () => setCurrentView(VIEWS.GAME);
  const handleOpenEditor = () => setCurrentView(VIEWS.EDITOR);
  const handleOpenBrowser = () => setCurrentView(VIEWS.BROWSER);
  const handleBackToMenu = () => setCurrentView(VIEWS.MENU);

  const handlePlayLevel = (levelData, chosenMode) => {
    loadLevel(levelData.grid, levelData.kValue, chosenMode); 
    setCurrentView(VIEWS.GAME);
  };

  // Leaderboard Logic 
  useEffect(() => { if (showLeaderboard) loadLeaderboard(); }, [showLeaderboard, mode]);
  useEffect(() => { setHasSaved(false); setUsername(''); }, [gameWon, mode]);
  
  const loadLeaderboard = async () => {
    const scores = await getLeaderboard(mode);
    setLeaderboardData(scores);
  };

  const handleSaveScore = async () => {
    if (!username.trim()) return;
    setIsSubmitting(true);

    const success = await saveScore(username, mode, uniqueSteps, timeElapsed);
    if (success) { setHasSaved(true); if (showLeaderboard) loadLeaderboard(); }
    setIsSubmitting(false);
  };

  // --- RENDER: MAIN MENU ---
  if (currentView === VIEWS.MENU) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4">
        <h1 className="text-6xl font-bold mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          PORTAL MAZE
        </h1>
        <div className="flex flex-col gap-4 w-64">
          <button onClick={handleStartGame} className="py-3 bg-blue-600 rounded-xl font-bold hover:scale-105 transition-transform">
            PLAY CLASSIC
          </button>
          <button onClick={handleOpenBrowser} className="py-3 bg-green-600 rounded-xl font-bold hover:scale-105 transition-transform">
            COMMUNITY MAPS
          </button>
          <button onClick={handleOpenEditor} className="py-3 bg-purple-600 rounded-xl font-bold hover:scale-105 transition-transform">
            CREATE LEVEL
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: EDITOR ---
  if (currentView === VIEWS.EDITOR) {
    return <LevelEditor onBack={handleBackToMenu} />;
  }

  // --- RENDER: BROWSER ---
  if (currentView === VIEWS.BROWSER) {
    return <LevelBrowser onPlay={handlePlayLevel} onBack={handleBackToMenu} />;
  }

  // --- RENDER: GAME (Existing Game UI) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-950 p-4">
      <div className="flex w-full max-w-2xl justify-between items-center mb-4">
        <button onClick={handleBackToMenu} className="text-gray-400 hover:text-white">← Main Menu</button>
        <h1 className="text-2xl font-bold tracking-widest text-purple-400">LAST_PUZZLE</h1>
        <div className="w-20"></div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="flex gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800">
          <button onClick={() => switchMode(GAME_MODES.NO_WALL_BREAK)} className={`px-4 py-2 rounded-lg font-bold ${mode === GAME_MODES.NO_WALL_BREAK ? 'bg-red-600 text-white' : 'text-gray-400'}`}>No Wall Break</button>
          <button onClick={() => switchMode(GAME_MODES.WALL_BREAK)} className={`px-4 py-2 rounded-lg font-bold ${mode === GAME_MODES.WALL_BREAK ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Wall Break</button>
        </div>
        <button onClick={() => setShowLeaderboard(!showLeaderboard)} className="px-6 py-2 rounded-xl font-bold bg-purple-600 border border-purple-400">
          {showLeaderboard ? "Close" : "🏆 Leaders"}
        </button>
      </div>

      {/* Leaderboard Modal  */}
      {showLeaderboard && (
        <div className="mb-8 w-full max-w-2xl bg-gray-900/90 border border-purple-500 rounded-xl p-6 shadow-2xl z-10 absolute top-20">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-300">🏆 Leaderboard</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="text-gray-400 border-b border-gray-700"><th>Rank</th><th>Player</th><th className="text-right">Steps</th><th className="text-right">Time</th></tr></thead>
            <tbody>
              {leaderboardData.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-800"><td className="p-2">#{i+1}</td><td className="p-2">{s.username}</td><td className="p-2 text-right text-green-400">{s.uniqueSteps}</td><td className="p-2 text-right text-yellow-400">{formatTime(s.timeElapsed)}s</td></tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowLeaderboard(false)} className="mt-4 w-full bg-gray-700 py-2 rounded">Close</button>
        </div>
      )}

      {/* HUD */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-xl bg-gray-900/50 p-4 rounded-lg border border-gray-700 w-full max-w-2xl">
        <div className="text-gray-400">TIME: <span className="text-yellow-400 font-bold ml-2 font-mono">{formatTime(timeElapsed)}s</span></div>
        <div className="text-gray-400">STEPS: <span className={`font-bold ml-2 ${uniqueSteps <= targetMoves ? 'text-green-400' : 'text-orange-400'}`}>{uniqueSteps}</span> <span className="text-sm">/ {targetMoves}</span></div>
        {mode === GAME_MODES.WALL_BREAK && <div className={`${drills > 0 ? 'text-blue-400' : 'text-red-500'}`}>DRILLS: <b>{drills}</b></div>}
      </div>

      {/* WIN SCREEN */}
      {gameWon && (
        <div className="mb-6 p-6 bg-green-900/90 border border-green-500 text-green-100 rounded-xl text-center shadow-2xl animate-float">
          <div className="text-3xl font-bold mb-4">LEVEL COMPLETED!</div>
          <div className="grid grid-cols-2 gap-4 text-left bg-black/30 p-4 rounded mb-4">
             <div>Efficiency:</div><div className="text-right font-bold">{uniqueSteps <= targetMoves ? "✅ Perfect" : `❌ +${uniqueSteps - targetMoves}`}</div>
             <div>Time:</div><div className="text-right font-bold text-yellow-300">{formatTime(timeElapsed)}s</div>
          </div>
          {!hasSaved ? (
            <div className="flex gap-2 justify-center">
              <input type="text" placeholder="Name" maxLength="20" value={username} onChange={e => setUsername(e.target.value)} className="px-3 py-2 rounded text-black font-bold outline-none w-32" />
              <button onClick={handleSaveScore} disabled={isSubmitting || !username} className="bg-yellow-500 text-black font-bold px-4 py-2 rounded">Save</button>
            </div>
          ) : <div className="text-yellow-300 font-bold animate-pulse">✅ Saved!</div>}
        </div>
      )}

      <GridBoard grid={grid} playerPos={playerPos} />
      
      <p className="mt-6 text-gray-500 text-sm text-center">
        Arrow Keys to Move <br/>
        {mode === GAME_MODES.WALL_BREAK ? <span className="text-blue-400">Shift + Arrow to Drill</span> : <span className="text-red-400">Drilling Disabled</span>}
      </p>
    </div>
  );
}