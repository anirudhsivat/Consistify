import React, { useState, useEffect } from 'react';
import { useHabits } from './hooks/useHabits';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import GoalBreakdown from './components/GoalBreakdown';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const { habits, moods, addHabit, deleteHabit, toggleHabit, addMood } = useHabits();
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
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Tracker<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Smart habit tracking & productivity coach.</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <Dashboard habits={habits} moods={moods} addMood={addMood} />
        
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-inner">
          <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">Your Habits</h2>
          <HabitForm addHabit={addHabit} />
          <HabitList habits={habits} toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
        </div>

        <GoalBreakdown addHabit={addHabit} />
        
        <footer className="mt-16 text-center text-sm text-zinc-400 dark:text-zinc-500 pb-8">
          Built with React & Tailwind CSS. Focus on consistency!
        </footer>
      </div>
    </div>
  );
}
