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
  
  // 1. Diet & Nutrition
  if (lowercaseGoal.match(/vegetarian|vegan|diet|eat|food|nutrition|meal/)) {
    return [
      { name: "Eat at least 1 plant-based meal", category: "Physical" },
      { name: "Try a new healthy recipe", category: "Learning" },
      { name: "Log daily food intake", category: "Other" }
    ];
  }
  
  // 2. Fitness & Health
  if (lowercaseGoal.match(/fitness|weight|health|gym|workout|muscle|fat|run|exercise/)) {
    return [
      { name: "30 min targeted workout", category: "Physical" },
      { name: "Stretch for 10 minutes", category: "Physical" },
      { name: "Drink 2L water", category: "Physical" }
    ];
  }
  
  // 3. Coding & Tech
  if (lowercaseGoal.match(/code|placement|job|software|developer|interview|tech|programming/)) {
    return [
      { name: "Solve 2 DSA problems", category: "Deep Work" },
      { name: "Work on portfolio project (45m)", category: "Deep Work" },
      { name: "Read 1 technical article", category: "Learning" }
    ];
  }

  // 4. Reading & Literature
  if (lowercaseGoal.match(/read|book|literature|novel/)) {
    return [
      { name: "Read 20 pages", category: "Learning" },
      { name: "Write 200 words", category: "Deep Work" },
      { name: "Read instead of scrolling (15m)", category: "Other" }
    ];
  }
  
  // 5. General Learning & Study
  if (lowercaseGoal.match(/learn|study|exam|school|college|skill|language/)) {
    return [
      { name: "Review notes for 30 mins", category: "Learning" },
      { name: "Undistracted study session (1 hr)", category: "Deep Work" },
      { name: "Test myself with flashcards", category: "Learning" }
    ];
  }
  
  // 6. Mindfulness & Mental Health
  if (lowercaseGoal.match(/meditate|mindfulness|stress|sleep|journal|mental/)) {
    return [
      { name: "10 min guided meditation", category: "Other" },
      { name: "Write in journal for 5 mins", category: "Deep Work" },
      { name: "No screens 1hr before bed", category: "Physical" }
    ];
  }

  // 7. Finance & Money
  if (lowercaseGoal.match(/money|save|budget|finance|invest|wealth/)) {
    return [
      { name: "Track daily expenses", category: "Other" },
      { name: "Read about investing (15m)", category: "Learning" },
      { name: "Avoid impulse purchases today", category: "Other" }
    ];
  }

  // Dynamic fallback: Extract the core subject from the goal by removing filler words
  const fillerWords = ['i', 'want', 'to', 'how', 'can', 'become', 'a', 'an', 'the', 'my', 'get', 'better', 'at', 'achieve', 'make', 'start', 'be'];
  let coreGoal = goal.split(' ')
    .filter(word => !fillerWords.includes(word.toLowerCase()))
    .join(' ')
    .trim();
    
  if (!coreGoal || coreGoal.length < 3) coreGoal = goal; // fallback if it becomes empty

  coreGoal = coreGoal.charAt(0).toUpperCase() + coreGoal.slice(1);

  // Dynamic suggestions incorporating their exact goal
  return [
    { name: `Practice ${coreGoal} for 30 mins`, category: "Deep Work" },
    { name: `Watch a tutorial on ${coreGoal}`, category: "Learning" },
    { name: `Plan tomorrow's step for ${coreGoal}`, category: "Other" }
  ];
}
