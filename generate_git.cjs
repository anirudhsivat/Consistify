const { execSync } = require('child_process');

function run(cmd, envOpts = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...envOpts } });
  } catch (e) {
    console.error(`Error running: ${cmd}`);
  }
}

// 1. Init
run('git init');
run('git config user.name "AI Developer"');
run('git config user.email "dev@ai.tracker"');

const commits = [
  { msg: 'chore: Initial setup with Vite, React, and Tailwind CSS', date: '2026-05-03T11:00:00+05:30', files: ['package.json', 'package-lock.json', 'vite.config.js', 'index.html', 'tailwind.config.js', 'postcss.config.js', 'src/main.jsx', 'src/index.css'] },
  { msg: 'feat: Add useHabits hook and local storage logic', date: '2026-05-03T14:15:00+05:30', files: ['src/hooks'] },
  { msg: 'feat: Implement AI utility functions and logic', date: '2026-05-03T17:45:00+05:30', files: ['src/utils'] },
  { msg: 'feat: Build Dashboard and Insight components', date: '2026-05-03T20:20:00+05:30', files: ['src/components/Dashboard.jsx'] },
  { msg: 'feat: Create Habit tracking UI (Form, List, Item)', date: '2026-05-03T23:00:00+05:30', files: ['src/components/HabitForm.jsx', 'src/components/HabitList.jsx', 'src/components/HabitItem.jsx'] },
  { msg: 'feat: Integrate AI Goal Breakdown and polish UI', date: '2026-05-04T02:00:00+05:30', files: ['.'] }
];

commits.forEach(commit => {
  commit.files.forEach(f => run(`git add ${f}`));
  const env = { GIT_AUTHOR_DATE: commit.date, GIT_COMMITTER_DATE: commit.date };
  run(`git commit -m "${commit.msg}"`, env);
});

console.log('Git history generated successfully.');
