import React from 'react';
import { format } from 'date-fns';
import { Trash2, Flame, AlertCircle, Sparkles } from 'lucide-react';
import { getHabitFailurePrediction } from '../utils/aiLogic';

export default function HabitItem({ habit, toggleHabit, deleteHabit, simulatedDate }) {
  const todayStr = format(simulatedDate || new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.history.includes(todayStr);
  const failurePrediction = getHabitFailurePrediction(habit);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Deep Work': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Physical': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Learning': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="group bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md border border-zinc-100 dark:border-zinc-700 transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => toggleHabit(habit.id, todayStr)}
            aria-label={isCompletedToday ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800
              ${isCompletedToday 
                ? 'bg-indigo-500 border-indigo-500 text-white' 
                : 'border-zinc-300 dark:border-zinc-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
          >
            {isCompletedToday && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
          </button>
          
          <div className="flex flex-col">
            <span className={`font-medium text-lg transition-colors ${isCompletedToday ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {habit.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${getCategoryColor(habit.category)}`}>
                {habit.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-orange-500 font-medium">
            <Flame size={20} className={habit.streakCount > 0 ? 'fill-orange-500' : 'text-zinc-300 dark:text-zinc-600'} />
            <span className={habit.streakCount === 0 ? 'text-zinc-400' : ''}>{habit.streakCount}</span>
          </div>
          
          <button 
            onClick={() => deleteHabit(habit.id)}
            aria-label={`Delete ${habit.name} habit`}
            className="text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {failurePrediction && !isCompletedToday && (
        <div className="flex items-start gap-2 mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-700 text-sm text-amber-600 dark:text-amber-400">
          {failurePrediction.includes('recover') ? (
            <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          )}
          <p>{failurePrediction}</p>
        </div>
      )}
    </div>
  );
}
