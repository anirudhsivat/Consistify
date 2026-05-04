import React, { useState } from 'react';
import { calculateConsistencyScore, getBehaviorAnalysis, getHabitTypeIntelligence, getWeeklySmartReport } from '../utils/aiLogic';
import { Activity, Brain, Calendar, TrendingUp, SmilePlus } from 'lucide-react';

export default function Dashboard({ habits, moods, addMood, simulatedDate }) {
  const consistencyScore = calculateConsistencyScore(habits, simulatedDate);
  const behaviorAnalysis = getBehaviorAnalysis(habits);
  const habitTypeIntel = getHabitTypeIntelligence(habits);
  const weeklyReport = getWeeklySmartReport(habits, simulatedDate);

  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    addMood(mood);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Consistency Score Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 mb-2 text-zinc-500 dark:text-zinc-400">
          <Activity size={20} />
          <h3 className="font-medium">Consistency Score</h3>
        </div>
        <div className="text-5xl font-bold text-zinc-900 dark:text-white mt-2">
          {consistencyScore}<span className="text-2xl text-zinc-400">/100</span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-2 rounded-full mt-4">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${consistencyScore}%` }}
          ></div>
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 flex flex-col justify-center">
        <div className="flex items-center space-x-2 mb-4 text-zinc-500 dark:text-zinc-400">
          <SmilePlus size={20} />
          <h3 className="font-medium">How are you feeling today?</h3>
        </div>
        <div className="flex justify-around mt-2">
          {['😄', '😐', '😔'].map(mood => (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`text-4xl hover:scale-110 transition-transform ${selectedMood === mood ? 'ring-2 ring-indigo-500 rounded-full bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
            >
              {mood}
            </button>
          ))}
        </div>
        {moods.length > 0 && (
          <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mt-4">
            Mood logged for today. You complete more habits when your mood is 😄.
          </p>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 md:col-span-2">
        <div className="flex items-center space-x-2 mb-4 text-zinc-500 dark:text-zinc-400">
          <Brain size={20} />
          <h3 className="font-medium">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {behaviorAnalysis && (
            <div className="flex items-start space-x-3 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
              <TrendingUp size={18} className="mt-0.5 text-indigo-500" />
              <p>{behaviorAnalysis}</p>
            </div>
          )}
          {habitTypeIntel && (
            <div className="flex items-start space-x-3 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
              <Activity size={18} className="mt-0.5 text-amber-500" />
              <p>{habitTypeIntel}</p>
            </div>
          )}
          {!behaviorAnalysis && !habitTypeIntel && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Add more habits and complete them to generate insights.</p>
          )}
        </div>
      </div>

      {/* Weekly Report */}
      {weeklyReport && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4 text-zinc-500 dark:text-zinc-400">
            <Calendar size={20} />
            <h3 className="font-medium">Weekly Smart Report</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{weeklyReport.totalCompleted}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Total Completed</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
              <div className="text-lg font-bold text-zinc-900 dark:text-white">{weeklyReport.mostProductiveDay}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Most Productive</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
              <div className="text-lg font-bold text-zinc-900 dark:text-white">{weeklyReport.leastProductiveDay}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Least Productive</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
