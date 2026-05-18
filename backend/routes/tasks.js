/**
 * TaskFlow - Tasks Router
 * REST API endpoints for managing tasks.
 *
 * GET    /api/tasks              - Retrieve all tasks (optional ?projectId= filter)
 * GET    /api/tasks/stats        - Get dashboard statistics
 * POST   /api/tasks              - Create a new task
 * PUT    /api/tasks/:id          - Update a task (title, priority, dueDate, etc.)
 * PATCH  /api/tasks/:id/toggle   - Toggle task completion status
 * DELETE /api/tasks/:id          - Delete a task
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/storage');

const router = express.Router();
const TASKS_FILE = 'tasks.json';

// Valid priority levels accepted by the API
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// ─── GET dashboard statistics ─────────────────────────────
// Must be defined before /:id to avoid route conflict
router.get('/stats', (req, res) => {
  try {
    const tasks = readData(TASKS_FILE);
    const now = new Date();

    // Count tasks in each status category
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;

    // Overdue: not completed and past due date
    const overdue = tasks.filter(t =>
      !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length;

    // Priority breakdown
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

    res.json({ total, completed, pending, overdue, highPriority });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats', message: err.message });
  }
});

// ─── GET all tasks (with optional projectId filter) ───────
router.get('/', (req, res) => {
  try {
    let tasks = readData(TASKS_FILE);

    // Filter by project if query param is provided
    if (req.query.projectId) {
      tasks = tasks.filter(t => t.projectId === req.query.projectId);
    }

    // Sort by creation date descending (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load tasks', message: err.message });
  }
});

// ─── POST create a new task ───────────────────────────────
router.post('/', (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId } = req.body;

    // Validate required title field
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Validate priority value if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }

    const tasks = readData(TASKS_FILE);

    // Construct new task object
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',    // Default to medium priority
      dueDate: dueDate || null,
      projectId: projectId || null,       // null means no project assigned
      completed: false,                   // New tasks start as incomplete
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    writeData(TASKS_FILE, tasks);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', message: err.message });
  }
});

// ─── PUT update a task ────────────────────────────────────
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, projectId, completed } = req.body;

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }

    const tasks = readData(TASKS_FILE);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Merge only the provided fields into the existing task
    tasks[index] = {
      ...tasks[index],
      title: title !== undefined ? title.trim() : tasks[index].title,
      description: description !== undefined ? description : tasks[index].description,
      priority: priority !== undefined ? priority : tasks[index].priority,
      dueDate: dueDate !== undefined ? dueDate : tasks[index].dueDate,
      projectId: projectId !== undefined ? projectId : tasks[index].projectId,
      completed: completed !== undefined ? completed : tasks[index].completed,
      updatedAt: new Date().toISOString(),
    };

    writeData(TASKS_FILE, tasks);
    res.json(tasks[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', message: err.message });
  }
});

// ─── PATCH toggle task completion ─────────────────────────
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readData(TASKS_FILE);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Flip the completed boolean
    tasks[index].completed = !tasks[index].completed;
    tasks[index].updatedAt = new Date().toISOString();

    writeData(TASKS_FILE, tasks);
    res.json(tasks[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle task', message: err.message });
  }
});

// ─── DELETE a task ────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readData(TASKS_FILE);
    const filtered = tasks.filter(t => t.id !== id);

    if (filtered.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    writeData(TASKS_FILE, filtered);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', message: err.message });
  }
});

module.exports = router;
