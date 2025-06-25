const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File-based data persistence
const DATA_FILE = path.join(__dirname, 'kanban-data.json');
const PROFILE_FILE = path.join(__dirname, 'profile.json');

// Default tasks for new installations
const defaultTasks = [
  {
    id: uuidv4(),
    title: 'Welcome to K7\'s Kanban! 🚀',
    description: 'This is your personal task management board. Create, edit, and organize your tasks!',
    status: 'TODO',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Drag and Drop Tasks',
    description: 'Try dragging this task to different columns to see the magic!',
    status: 'IN_PROGRESS',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Set Your Profile Picture',
    description: 'Click on the profile area to upload your picture',
    status: 'TODO',
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Load tasks from file
function loadTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return defaultTasks;
}

// Save tasks to file
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

// Load profile from file
function loadProfile() {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  return { name: 'K7', profilePicture: null };
}

// Save profile to file
function saveProfile(profile) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

// Initialize data
let tasks = loadTasks();
let profile = loadProfile();

// Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority = 'medium' } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'TODO',
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, status, priority } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    status: status || tasks[taskIndex].status,
    priority: priority || tasks[taskIndex].priority,
    updatedAt: new Date().toISOString()
  };

  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  res.status(204).send();
});

// Update task status
app.patch('/api/tasks/:id/status', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { status } = req.body;
  
  if (!['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();

  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

// Profile routes
// Get profile
app.get('/api/profile', (req, res) => {
  res.json(profile);
});

// Update profile
app.put('/api/profile', (req, res) => {
  const { name, profilePicture } = req.body;
  
  profile = {
    name: name || profile.name,
    profilePicture: profilePicture !== undefined ? profilePicture : profile.profilePicture
  };
  
  saveProfile(profile);
  res.json(profile);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Futuristic Kanban server running on port ${PORT}`);
});
