import { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('ai-habit-tracker-habits');
    if (saved) {
      // Recalculate streaks on load just in case days have passed
      const parsed = JSON.parse(saved);
      return parsed.map(h => ({...h, streakCount: calculateStreak(h.history)}));
    }
    return [];
  });

  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem('ai-habit-tracker-moods');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ai-habit-tracker-habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('ai-habit-tracker-moods', JSON.stringify(moods));
  }, [moods]);

  // history is an array of 'yyyy-MM-dd' strings
  function calculateStreak(history) {
    if (!history || history.length === 0) return 0;
    
    const sortedDates = [...history].sort((a, b) => new Date(b) - new Date(a));
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    
    let firstDate = startOfDay(parseISO(sortedDates[0]));
    
    // If last completed date is before yesterday, streak is broken (0)
    if (firstDate < yesterday) {
       return 0; 
    }

    let streak = 0;
    let currentDateToCheck = firstDate;

    for (let i = 0; i < sortedDates.length; i++) {
        const d = startOfDay(parseISO(sortedDates[i]));
        if (d.getTime() === currentDateToCheck.getTime()) {
            streak++;
            currentDateToCheck = subDays(currentDateToCheck, 1);
        } else {
            break;
        }
    }
    return streak;
  }

  const addHabit = (name, category) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      category,
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      history: [],
      streakCount: 0
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabit = (id, dateString) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const hasCompleted = habit.history.includes(dateString);
        let newHistory = hasCompleted 
          ? habit.history.filter(d => d !== dateString)
          : [...habit.history, dateString];
        
        return {
          ...habit,
          history: newHistory,
          streakCount: calculateStreak(newHistory)
        };
      }
      return habit;
    }));
  };

  const addMood = (moodStr) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingIndex = moods.findIndex(m => m.date === todayStr);
    
    if (existingIndex >= 0) {
      const newMoods = [...moods];
      newMoods[existingIndex] = { date: todayStr, mood: moodStr };
      setMoods(newMoods);
    } else {
      setMoods([...moods, { date: todayStr, mood: moodStr }]);
    }
  };

  return { habits, moods, addHabit, deleteHabit, toggleHabit, addMood };
}
