import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Prevent caching for API routes
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const dataDir = path.join(__dirname, 'data');

const readJSON = (file) => {
  const data = fs.readFileSync(path.join(dataDir, file), 'utf8');
  return JSON.parse(data);
};

const writeJSON = (file, data) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
};

app.get('/api/dashboard', (req, res) => {
  const users = readJSON('users.json');
  const goals = readJSON('goals.json');
  const tasks = readJSON('tasks.json');
  let backpats = readJSON('backpats.json') || [];
  
  // Ensure sorted by timestamp descending
  backpats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    users,
    goals,
    tasks,
    backpats: backpats.slice(0, 50) // Return 50 most recent items
  });
});

app.post('/api/tasks', (req, res) => {
  const tasks = readJSON('tasks.json');
  const newTask = {
    id: Date.now(),
    assignee: req.body.assignee,
    title: req.body.title,
    category: req.body.category,
    completed: false
  };
  if (newTask.category === "Family Shared Goal") {
    newTask.contributionValue = parseInt(req.body.contributionValue) || 5;
  }
  tasks.push(newTask);
  writeJSON('tasks.json', tasks);
  
  // Log task creation to backpats.json
  try {
    const backpats = readJSON('backpats.json') || [];
    const users = readJSON('users.json') || {};
    const creatorName = (users[newTask.assignee] && users[newTask.assignee].name) ? users[newTask.assignee].name : newTask.assignee;
    
    const newLog = {
      id: Date.now(),
      from: creatorName,
      to: 'family',
      type: 'Task Created',
      message: `${creatorName} added a new task: ${newTask.title}`,
      timestamp: new Date().toISOString()
    };
    
    backpats.unshift(newLog);
    writeJSON('backpats.json', backpats);
  } catch(e) {
    console.error("Error logging task creation:", e);
  }
  
  res.json(newTask);
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const tasks = readJSON('tasks.json');
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    task.completed = !task.completed;
    writeJSON('tasks.json', tasks);
    
    if (task.category === "Family Shared Goal") {
      const goals = readJSON('goals.json');
      if (goals.length > 0) {
        const activeGoal = goals[0];
        const contribution = task.contributionValue || 5;
        if (task.completed) {
          activeGoal.progress = Math.min(activeGoal.target, activeGoal.progress + contribution);
        } else {
          activeGoal.progress = Math.max(0, activeGoal.progress - contribution);
        }
        writeJSON('goals.json', goals);
      }
    }
    
    // Log completion to activity feed
    try {
      if (task.completed) {
        const backpats = readJSON('backpats.json') || [];
        const users = readJSON('users.json') || {};
        const goals = readJSON('goals.json') || [];
        
        const userName = (users[task.assignee] && users[task.assignee].name) ? users[task.assignee].name : task.assignee;
        let message = `${userName} completed '${task.title || 'a task'}'!`;
        
        if (task.category === "Family Shared Goal" && goals.length > 0) {
          const activeGoal = goals[0];
          const contribution = task.contributionValue || 5;
          message = `${userName} completed '${task.title || 'a task'}' (+${contribution}% to ${activeGoal.title || 'Shared Goal'})!`;
        }
        
        const newBackpat = {
          id: Date.now(),
          from: userName,
          to: 'family',
          type: 'Task Completed',
          message: message,
          timestamp: new Date().toISOString()
        };
        
        console.log('Writing task completion to backpats.json:', newBackpat);
        backpats.unshift(newBackpat);
        writeJSON('backpats.json', backpats);
      }
    } catch (e) {
      console.error("Error writing to backpats.json:", e);
    }
    
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/backpats', (req, res) => {
  const backpats = readJSON('backpats.json');
  const newBackpat = {
    id: Date.now(),
    from: req.body.from || 'sarah',
    to: req.body.to || 'dave',
    type: req.body.type,
    message: req.body.message,
    timestamp: new Date().toISOString()
  };
  backpats.unshift(newBackpat); // Add to beginning
  writeJSON('backpats.json', backpats);
  res.json(newBackpat);
});

app.get('/api/roster', (req, res) => {
  res.json({ status: "Day 5 of 14 on Site" });
});

// Update active goal
app.put('/api/goals/active', (req, res) => {
  const goals = readJSON('goals.json');
  const backpats = readJSON('backpats.json');
  const { title, target } = req.body;
  
  if (goals.length > 0) {
    goals[0].title = title || goals[0].title;
    goals[0].target = target !== undefined ? parseInt(target) : goals[0].target;
  } else {
    goals.push({ id: Date.now(), title, progress: 0, target: parseInt(target) || 100 });
  }
  
  writeJSON('goals.json', goals);

  // Add automated activity log
  const newBackpat = {
    id: Date.now(),
    from: 'system',
    to: 'everyone',
    type: 'Goal Update',
    message: `The shared family goal was updated to '${title}'!`,
    timestamp: new Date().toISOString()
  };
  backpats.unshift(newBackpat);
  writeJSON('backpats.json', backpats);

  res.json(goals[0]);
});

// Reset all entered data (tasks, goal, activity feed) back to empty
app.post('/api/reset', (req, res) => {
  writeJSON('tasks.json', []);
  writeJSON('goals.json', []);
  writeJSON('backpats.json', []);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
