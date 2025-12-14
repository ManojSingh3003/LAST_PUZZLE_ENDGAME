import { useState } from 'react';
import { GRID_SIZE, CELL_TYPES } from '../constants';
import { calculateLevelPar } from '../utils/pathfinding';
import { publishLevel } from '../services/levels';

const PALETTE = [
  { id: CELL_TYPES.EMPTY, label: 'Path', color: 'bg-gray-800' },
  { id: CELL_TYPES.WALL, label: 'Wall', color: 'bg-gray-600' },
  { id: CELL_TYPES.START, label: 'Start', color: 'bg-blue-500' },
  { id: CELL_TYPES.GOAL, label: 'Goal', color: 'bg-green-500' },
  { id: CELL_TYPES.PORTAL_A, label: 'Portal A', color: 'bg-orange-500' },
  { id: CELL_TYPES.PORTAL_B, label: 'Portal B', color: 'bg-purple-500' },
  { id: CELL_TYPES.PORTAL_C, label: 'Portal C', color: 'bg-cyan-500' },
  { id: CELL_TYPES.PORTAL_D, label: 'Portal D', color: 'bg-emerald-600' },
  { id: CELL_TYPES.PORTAL_E, label: 'Portal E', color: 'bg-rose-500' },
];

export default function LevelEditor({ onBack }) {
  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill(CELL_TYPES.EMPTY));
  const [selectedTool, setSelectedTool] = useState(CELL_TYPES.WALL);
  const [levelName, setLevelName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [kValue, setKValue] = useState(3);
  const [message, setMessage] = useState('');

  const handleCellClick = (index) => {
    const newGrid = [...grid];
    
    // Logic: Only 1 Start and 1 Goal allowed
    if (selectedTool === CELL_TYPES.START) {
      const oldStart = newGrid.indexOf(CELL_TYPES.START);
      if (oldStart !== -1) newGrid[oldStart] = CELL_TYPES.EMPTY;
    }
    if (selectedTool === CELL_TYPES.GOAL) {
      const oldGoal = newGrid.indexOf(CELL_TYPES.GOAL);
      if (oldGoal !== -1) newGrid[oldGoal] = CELL_TYPES.EMPTY;
    }

    newGrid[index] = selectedTool;
    setGrid(newGrid);
  };

  const handlePublish = async () => {
    setMessage("Validating map...");
    
    // 1. Validate Structure
    if (!grid.includes(CELL_TYPES.START)) return setMessage("❌ Error: Missing START point.");
    if (!grid.includes(CELL_TYPES.GOAL)) return setMessage("❌ Error: Missing GOAL point.");
    if (!levelName.trim()) return setMessage("❌ Error: Level name is required.");

    // 2. Validate Portals (Must be pairs)
    const portals = [
       CELL_TYPES.PORTAL_A, CELL_TYPES.PORTAL_B, 
       CELL_TYPES.PORTAL_C, CELL_TYPES.PORTAL_D, CELL_TYPES.PORTAL_E
    ];
    for (let pType of portals) {
       const count = grid.filter(c => c === pType).length;
       if (count !== 0 && count !== 2) {
          return setMessage(`❌ Error: Portal ${String.fromCharCode(65 + (pType - 4))} must have exactly 2 ends.`);
       }
    }

    // 3. Automatic Validation (Pathfinding)
    const scores = calculateLevelPar(grid, kValue);
    
    if (scores.minStepsWithBreak === Infinity) {
      return setMessage("❌ Error: Map is impossible to solve! (Goal unreachable)");
    }

    // 4. Publish
    setMessage("Map valid! Publishing...");
    const success = await publishLevel(levelName, authorName, grid, kValue, scores);
    
    if (success) {
      setMessage("✅ Level Published Successfully!");
      setTimeout(onBack, 1500);
    } else {
      setMessage("❌ Error saving to database.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Map Editor</h2>

      {/* Inputs */}
      <div className="flex gap-4 mb-4">
        <input 
          placeholder="Level Name" 
          className="p-2 rounded text-black font-bold"
          value={levelName} onChange={e => setLevelName(e.target.value)}
        />
        <input 
          placeholder="Author" 
          className="p-2 rounded text-black font-bold"
          value={authorName} onChange={e => setAuthorName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span>Max Drills (K):</span>
          <input 
            type="number" min="0" max="10" 
            className="p-2 w-16 rounded text-black font-bold"
            value={kValue} onChange={e => setKValue(e.target.value)}
          />
        </div>
      </div>

      {/* Palette */}
      <div className="flex gap-2 mb-4 bg-gray-800 p-2 rounded">
        {PALETTE.map(tool => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={`px-3 py-1 rounded transition-colors ${selectedTool === tool.id ? 'ring-2 ring-white ' + tool.color : 'opacity-50 ' + tool.color}`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Editor Grid */}
      <div 
        className="grid gap-1 mb-4 border-2 border-gray-600 p-1"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)'
        }}
      >
        {grid.map((cell, idx) => (
          <div 
            key={idx}
            onClick={() => handleCellClick(idx)}
            className={`cursor-pointer hover:opacity-80 border border-gray-700/50 ${
              cell === CELL_TYPES.WALL ? 'bg-gray-600' :
              cell === CELL_TYPES.START ? 'bg-blue-500' :
              cell === CELL_TYPES.GOAL ? 'bg-green-500' :
              cell === CELL_TYPES.PORTAL_A ? 'bg-orange-500' :
              cell === CELL_TYPES.PORTAL_B ? 'bg-purple-500' :
              'bg-gray-900'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="text-center">
        <p className="font-bold text-yellow-400 mb-4 h-6">{message}</p>
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
          <button onClick={handlePublish} className="px-6 py-2 bg-green-600 rounded hover:bg-green-500 font-bold">Publish Map</button>
        </div>
      </div>
    </div>
  );
}