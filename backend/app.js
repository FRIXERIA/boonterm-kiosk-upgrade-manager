const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { validateCreateTask, validateUpdateTask, validateAddFile, VALID_FILE_TYPES } = require('./validators/taskValidator');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, 'data', 'tasks.json');

const DATA_DIR = path.dirname(DATA_FILE);
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

function readTasks() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ─── Tasks CRUD ───────────────────────────────────────────────────────────────

app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.get('/api/tasks/:id', (req, res) => {
  const task = readTasks().find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const error = validateCreateTask(req.body);
  if (error) return res.status(400).json({ error });

  const tasks = readTasks();
  const now = new Date().toISOString();
  const newTask = {
    id: uuidv4(),
    name: req.body.name.trim(),
    kioskType: req.body.kioskType || 'BT7',
    taskType: req.body.taskType || 'software_update',
    status: req.body.status || 'pending',
    scheduledDate: req.body.scheduledDate,
    description: req.body.description || '',
    files: [],
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const error = validateUpdateTask(req.body);
  if (error) return res.status(400).json({ error });

  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index] = { ...tasks[index], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
  writeTasks(tasks);
  res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const filtered = tasks.filter(t => t.id !== req.params.id);
  if (filtered.length === tasks.length) return res.status(404).json({ error: 'Task not found' });
  writeTasks(filtered);
  res.json({ success: true });
});

// ─── File endpoints ───────────────────────────────────────────────────────────

app.get('/api/tasks/:id/files', (req, res) => {
  const task = readTasks().find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const grouped = Object.fromEntries(VALID_FILE_TYPES.map(t => [t, []]));
  (task.files || []).forEach(f => {
    if (grouped[f.fileType]) grouped[f.fileType].push(f);
  });
  res.json(grouped);
});

app.post('/api/tasks/:id/files', (req, res) => {
  const error = validateAddFile(req.body);
  if (error) return res.status(400).json({ error });

  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const newFile = {
    id: uuidv4(),
    filename: req.body.filename.trim(),
    fileType: req.body.fileType,
    isModified: Boolean(req.body.isModified),
  };
  tasks[index].files = [...(tasks[index].files || []), newFile];
  tasks[index].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  res.status(201).json(newFile);
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
