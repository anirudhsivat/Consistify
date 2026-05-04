import { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO, startOfDay, subDays, addDays } from 'date-fns';

export function useHabits() {
  const [simulatedDate, setSimulatedDate] = useState(() => {
    const saved = localStorage.getItem('ai-habit-tracker-date');
    return saved ? new Date(saved) : new Date();
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('ai-habit-tracker-habits');
    if (saved) {
      const parsed = JSON.parse(saved);
      // We pass the initial simulatedDate to calculate streaks correctly on load
      const initialDate = localStorage.getItem('ai-habit-tracker-date') ? new Date(localStorage.getItem('ai-habit-tracker-date')) : new Date();
      return parsed.map(h => ({...h, streakCount: calculateStreak(h.history, initialDate)}));
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

  useEffect(() => {
    localStorage.setItem('ai-habit-tracker-date', simulatedDate.toISOString());
  }, [simulatedDate]);

  function advanceDay() {
    const nextDay = addDays(simulatedDate, 1);
    setSimulatedDate(nextDay);
    
    // Recalculate streaks for all habits because a day passing might break them
    setHabits(prevHabits => 
      prevHabits.map(h => ({
        ...h,
        streakCount: calculateStreak(h.history, nextDay)
      }))
    );
  }

  // history is an array of 'yyyy-MM-dd' strings
  function calculateStreak(history, targetDate) {
    if (!history || history.length === 0) return 0;
    
    const sortedDates = [...history].sort((a, b) => new Date(b) - new Date(a));
    const today = startOfDay(targetDate);
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
      createdDate: format(simulatedDate, 'yyyy-MM-dd'),
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
          streakCount: calculateStreak(newHistory, simulatedDate)
        };
      }
      return habit;
    }));
  };

  const addMood = (moodStr) => {
    const todayStr = format(simulatedDate, 'yyyy-MM-dd');
    const existingIndex = moods.findIndex(m => m.date === todayStr);
    
    if (existingIndex >= 0) {
      const newMoods = [...moods];
      newMoods[existingIndex] = { date: todayStr, mood: moodStr };
      setMoods(newMoods);
    } else {
      setMoods([...moods, { date: todayStr, mood: moodStr }]);
    }
  };

  const resetData = () => {
    setHabits([]);
    setMoods([]);
    setSimulatedDate(new Date());
    localStorage.removeItem('ai-habit-tracker-habits');
    localStorage.removeItem('ai-habit-tracker-moods');
    localStorage.removeItem('ai-habit-tracker-date');
  };

  return { habits, moods, addHabit, deleteHabit, toggleHabit, addMood, simulatedDate, advanceDay, resetData };
}
