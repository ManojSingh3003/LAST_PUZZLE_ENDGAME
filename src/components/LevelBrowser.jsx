import { useState, useEffect } from 'react';
import { getCommunityLevels } from '../services/levels';
import { GRID_SIZE, CELL_TYPES, GAME_MODES } from '../constants'; 

export default function LevelBrowser({ onPlay, onBack }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    const data = await getCommunityLevels();
    setLevels(data);
    setLoading(false);
  };

  const renderMiniGrid = (grid) => (
    <div 
      className="grid gap-px border border-gray-600 bg-gray-900 mb-2"
      style={{ 
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        width: '100px', height: '100px'
      }}
    >
      {grid.map((cell, i) => (
        <div key={i} className={`w-full h-full ${
          cell === CELL_TYPES.WALL ? 'bg-gray-600' :
          cell === CELL_TYPES.START ? 'bg-blue-500' :
          cell === CELL_TYPES.GOAL ? 'bg-green-500' :
          'bg-gray-800'
        }`} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white p-6">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={onBack} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Community Maps
        </h2>
        <div className="w-20"></div>
      </div>

      {loading ? (
        <div className="text-xl animate-pulse">Loading maps...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {levels.map(level => {

            const isNoBreakPossible = Number.isFinite(level.parNoBreak) && level.parNoBreak > 0;

            return (
              <div key={level.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl hover:border-purple-500 transition-all shadow-lg flex flex-col items-center text-center">
                <h3 className="font-bold text-xl text-white mb-1">{level.name}</h3>
                <p className="text-gray-400 text-sm mb-3">by {level.author}</p>
                
                {renderMiniGrid(level.grid)}
                
                <div className="flex justify-between w-full text-xs text-gray-500 mt-2 px-2">
                  <span>No-Break Par: {isNoBreakPossible ? level.parNoBreak : 'N/A'}</span>
                  <span>Max Drills: {level.kValue}</span>
                </div>

                {/* Merged Play Button */}
                <div className="w-full mt-4">
                  <button 
                    onClick={() => onPlay(level, GAME_MODES.WALL_BREAK)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors text-lg"
                  >
                    SOLVE MAP
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}