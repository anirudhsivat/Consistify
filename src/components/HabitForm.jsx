import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function HabitForm({ addHabit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');

  const categories = ['Deep Work', 'Physical', 'Learning', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name, category);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new habit..."
        aria-label="New habit name"
        className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Select habit category"
        className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-300 cursor-pointer"
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        type="submit"
        aria-label="Add habit"
        className="px-4 py-3 bg-zinc-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-zinc-800 dark:hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        <Plus size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
