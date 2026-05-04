import { format, subDays, parseISO, getDay, differenceInDays } from 'date-fns';

export function calculateConsistencyScore(habits, currentDate = new Date()) {
  if (habits.length === 0) return 0;
  
  let totalScore = 0;
  const today = currentDate;

  habits.forEach(habit => {
    const createdDate = parseISO(habit.createdDate);
    const daysSinceCreation = Math.max(1, differenceInDays(today, createdDate) + 1);
    const completionRate = habit.history.length / daysSinceCreation;
    
    // Score out of 100 per habit
    // 70% based on completion rate, 30% based on current streak vs possible days
    const habitScore = (completionRate * 70) + (Math.min(habit.streakCount / 5, 1) * 30);
    totalScore += habitScore;
  });

  return Math.round(totalScore / habits.length);
}

export function getHabitFailurePrediction(habit) {
  if (!habit.history || habit.history.length < 3) return null;
  
  // Find typical streak breaking point (very simple logic for demonstration)
  // For example, if streak is currently 3, and they often miss on day 4.
  // We'll mock this: if they have broken a streak > 2 before, warn them around that number.
  
  // Fake logic: warn if streak > 2 and current streak is a multiple of 3
  if (habit.streakCount > 0 && habit.streakCount % 3 === 0) {
    return `You usually miss this habit after ${habit.streakCount} days. Stay consistent today!`;
  }
  
  // Streak recovery mode
  if (habit.streakCount === 0 && habit.history.length > 0) {
     return "Streak broken! Do a smaller version today to recover your streak.";
  }

  return null;
}

export function getBehaviorAnalysis(habits) {
  if (habits.length === 0) return null;
  
  let weekdayCount = 0;
  let weekendCount = 0;
  
  habits.forEach(habit => {
    habit.history.forEach(dateStr => {
      const day = getDay(parseISO(dateStr));
      if (day === 0 || day === 6) {
        weekendCount++;
      } else {
        weekdayCount++;
      }
    });
  });

  const total = weekdayCount + weekendCount;
  if (total < 3) return "Complete more habits to get behavior insights.";

  if (weekdayCount / 5 > weekendCount / 2) {
    return "Insight: You perform better on weekdays.";
  } else if (weekendCount / 2 > weekdayCount / 5) {
    return "Insight: You are more consistent on weekends.";
  }
  return "Insight: You have a balanced consistency across the week.";
}

export function getHabitTypeIntelligence(habits) {
  if (habits.length === 0) return null;
  
  const categories = {
    'Deep Work': 0,
    'Physical': 0,
    'Learning': 0,
    'Other': 0
  };
  
  habits.forEach(habit => {
    if (categories[habit.category] !== undefined) {
      categories[habit.category] += habit.history.length;
    }
  });
  
  let minCategory = 'Physical';
  let minCount = Infinity;
  let hasData = false;
  
  for (const [cat, count] of Object.entries(categories)) {
    if (count > 0) hasData = true;
    // only check if user actually has a habit in this category
    const hasHabitInCat = habits.some(h => h.category === cat);
    if (hasHabitInCat && count < minCount) {
      minCount = count;
      minCategory = cat;
    }
  }

  if (!hasData) return null;

  return `Insight: You are neglecting your ${minCategory} habits. Try focusing on them today!`;
}

export function getWeeklySmartReport(habits, currentDate = new Date()) {
  if (habits.length === 0) return null;

  const today = currentDate;
  const last7Days = Array.from({length: 7}).map((_, i) => format(subDays(today, i), 'yyyy-MM-dd'));
  
  let totalCompleted = 0;
  const dayCounts = {};
  last7Days.forEach(d => dayCounts[d] = 0);

  habits.forEach(habit => {
    habit.history.forEach(dateStr => {
      if (dayCounts[dateStr] !== undefined) {
        dayCounts[dateStr]++;
        totalCompleted++;
      }
    });
  });

  let mostProductive = last7Days[0];
  let leastProductive = last7Days[0];

  for (const date of last7Days) {
    if (dayCounts[date] > dayCounts[mostProductive]) mostProductive = date;
    if (dayCounts[date] < dayCounts[leastProductive]) leastProductive = date;
  }

  return {
    totalCompleted,
    mostProductiveDay: format(parseISO(mostProductive), 'EEEE'),
    leastProductiveDay: format(parseISO(leastProductive), 'EEEE')
  };
}

export function getGoalBreakdown(goal) {
  const lowercaseGoal = goal.toLowerCase();
  
  if (lowercaseGoal.includes("fitness") || lowercaseGoal.includes("weight") || lowercaseGoal.includes("health")) {
    return [
      { name: "30 min workout", category: "Physical" },
      { name: "Drink 2L water", category: "Physical" },
      { name: "Eat a healthy meal", category: "Other" }
    ];
  }
  
  if (lowercaseGoal.includes("code") || lowercaseGoal.includes("placement") || lowercaseGoal.includes("job")) {
    return [
      { name: "Study DSA for 1 hour", category: "Deep Work" },
      { name: "Practice 2 LeetCode problems", category: "Deep Work" },
      { name: "Revise CS concepts", category: "Learning" }
    ];
  }

  if (lowercaseGoal.includes("learn") || lowercaseGoal.includes("study")) {
    return [
      { name: "Read for 30 mins", category: "Learning" },
      { name: "Take notes on new topic", category: "Deep Work" },
      { name: "Review flashcards", category: "Learning" }
    ];
  }

  // Generic fallback
  return [
    { name: "Review daily goals", category: "Other" },
    { name: "Work on primary task (1 hr)", category: "Deep Work" },
    { name: "Reflect on progress", category: "Other" }
  ];
}
