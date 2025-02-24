import React, { useState, useEffect } from 'react';
import { Link2, Loader2, AlertCircle } from 'lucide-react';
import { fetchKanbanData } from './api/mockData';
import { analyzeBoardData } from './api/chatGPTService';

function App() {
  const [inputText, setInputText] = useState('');
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capacities, setCapacities] = useState({});
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const performAnalysis = async (lanesData, capacitiesData) => {
    setAnalyzing(true);
    try {
      const analysisResult = await analyzeBoardData(lanesData, capacitiesData);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze board data');
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKanbanData();
      setLanes(data.lanes);
      // Initialize capacities for new lanes
      const initialCapacities = {};
      data.lanes.forEach(lane => {
        initialCapacities[lane.id] = capacities[lane.id] || 10;
      });
      setCapacities(initialCapacities);
      
      // Trigger analysis after data is loaded
      await performAnalysis(data.lanes, initialCapacities);
    } catch (err) {
      setError('Failed to fetch kanban data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    console.log('Submitted:', inputText);
    setInputText('');
    // Refresh data after submission
    fetchData();
  };

  const handleCapacityChange = async (laneId, value) => {
    const newCapacities = {
      ...capacities,
      [laneId]: value
    };
    setCapacities(newCapacities);
    
    // Trigger analysis when capacity changes
    await performAnalysis(lanes, newCapacities);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Input Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your Jira feature id..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Loading...' : 'Fetch Feature Data'}
          </button>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Board Analysis</h2>
            {analyzing && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>
          <div className="prose prose-sm max-w-none">
            {analysis ? (
              <div className="whitespace-pre-line text-gray-700">{analysis}</div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle size={18} />
                <span>No analysis available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mb-8">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      )}

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lanes.map((lane) => (
            <div key={lane.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">{lane.title}</h2>
                <div className="flex items-center gap-2">
                  <label htmlFor={`capacity-${lane.id}`} className="text-sm text-gray-600">
                    Capacity:
                  </label>
                  <input
                    id={`capacity-${lane.id}`}
                    type="number"
                    value={capacities[lane.id] || 10}
                    onChange={(e) => handleCapacityChange(lane.id, parseInt(e.target.value, 10))}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {lane.cards.map((card) => (
                  <div key={card.id} className="bg-white rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <a
                        href={card.link}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Link2 size={16} />
                        <span>View</span>
                      </a>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {card.storyPoints} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;