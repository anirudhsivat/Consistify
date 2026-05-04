import React from 'react';
import HabitItem from './HabitItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function HabitList({ habits, toggleHabit, deleteHabit, simulatedDate }) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm">
        <p className="text-zinc-500 dark:text-zinc-400">No habits yet. Start building one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {habits.map(habit => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HabitItem
              habit={habit}
              toggleHabit={toggleHabit}
              deleteHabit={deleteHabit}
              simulatedDate={simulatedDate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
