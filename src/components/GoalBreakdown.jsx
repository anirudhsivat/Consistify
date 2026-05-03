import React, { useState } from 'react';
import { Target, Sparkles, Check } from 'lucide-react';
import { getGoalBreakdown } from '../utils/aiLogic';

export default function GoalBreakdown({ addHabit }) {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [addedIndexes, setAddedIndexes] = useState([]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    const newSuggestions = getGoalBreakdown(goal);
    setSuggestions(newSuggestions);
    setAddedIndexes([]);
  };

  const handleAddSuggestion = (suggestion, index) => {
    addHabit(suggestion.name, suggestion.category);
    setAddedIndexes([...addedIndexes, index]);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-3xl shadow-sm border border-indigo-100 dark:border-zinc-700 mt-8 mb-8">
      <div className="flex items-center space-x-2 mb-4 text-indigo-700 dark:text-indigo-400">
        <Target size={24} />
        <h2 className="text-xl font-semibold">Goal Breakdown (AI Coach)</h2>
      </div>
      
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
        Tell me your big goal, and I'll break it down into daily habits for you.
      </p>

      <form onSubmit={handleGenerate} className="flex gap-3 mb-6">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Crack tech placements..."
          className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 dark:border-zinc-600 bg-white/80 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <Sparkles size={18} />
          <span className="hidden sm:inline">Suggest</span>
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Suggested Habits:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suggestions.map((suggestion, index) => {
              const isAdded = addedIndexes.includes(index);
              return (
                <div key={index} className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-indigo-100 dark:border-zinc-700 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 mb-2 inline-block">
                      {suggestion.category}
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-white text-sm mb-4">{suggestion.name}</p>
                  </div>
                  <button
                    onClick={() => handleAddSuggestion(suggestion, index)}
                    disabled={isAdded}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                      ${isAdded 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
                        : 'bg-indigo-50 dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-zinc-600'}`}
                  >
                    {isAdded ? <><Check size={16} /> Added</> : 'Add Habit'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
