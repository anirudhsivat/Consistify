import React, { useState, useEffect } from 'react';
import { useHabits } from './hooks/useHabits';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import GoalBreakdown from './components/GoalBreakdown';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const { habits, moods, addHabit, deleteHabit, toggleHabit, addMood, simulatedDate, advanceDay, resetData } = useHabits();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from system preference or local storage
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-wider drop-shadow-sm">
              Consist<span className="text-indigo-600 dark:text-indigo-400">ify</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Smart habit tracking & productivity coach.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetData}
              className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors text-sm flex items-center gap-2"
            >
              Reset Data 🔄
            </button>
            <button
              onClick={advanceDay}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition-colors text-sm flex items-center gap-2"
            >
              Next Day ⏩
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        <Dashboard habits={habits} moods={moods} addMood={addMood} simulatedDate={simulatedDate} />
        
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-inner">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Your Habits</h2>
            <span className="text-sm text-zinc-500 font-medium bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full">
              {simulatedDate.toLocaleDateString()}
            </span>
          </div>
          <HabitForm addHabit={addHabit} />
          <HabitList habits={habits} toggleHabit={toggleHabit} deleteHabit={deleteHabit} simulatedDate={simulatedDate} />
        </div>

        <GoalBreakdown addHabit={addHabit} />
        
        <footer className="mt-16 text-center text-sm text-zinc-400 dark:text-zinc-500 pb-8">
          Built with React & Tailwind CSS. Focus on consistency!
        </footer>
      </div>
    </div>
  );
}
