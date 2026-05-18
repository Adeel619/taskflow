/**
 * TaskFlow - Projects Router
 * REST API endpoints for managing project boards.
 *
 * GET    /api/projects         - Retrieve all projects
 * POST   /api/projects         - Create a new project
 * PUT    /api/projects/:id     - Update an existing project
 * DELETE /api/projects/:id     - Delete a project (and its tasks)
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/storage');

const router = express.Router();
const PROJECTS_FILE = 'projects.json';
const TASKS_FILE = 'tasks.json';

// ─── GET all projects ─────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const projects = readData(PROJECTS_FILE);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load projects', message: err.message });
  }
});

// ─── POST create a new project ────────────────────────────
router.post('/', (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projects = readData(PROJECTS_FILE);

    // Build new project object
    const newProject = {
      id: uuidv4(),           // Unique identifier
      name: name.trim(),
      description: description || '',
      color: color || '#4A90D9', // Default blue color
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    writeData(PROJECTS_FILE, projects);

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project', message: err.message });
  }
});

// ─── PUT update an existing project ──────────────────────
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const projects = readData(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === id);

    // Return 404 if project not found
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Merge updates into existing project
    projects[index] = {
      ...projects[index],
      name: name !== undefined ? name.trim() : projects[index].name,
      description: description !== undefined ? description : projects[index].description,
      color: color !== undefined ? color : projects[index].color,
      updatedAt: new Date().toISOString(),
    };

    writeData(PROJECTS_FILE, projects);
    res.json(projects[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project', message: err.message });
  }
});

// ─── DELETE a project and all its tasks ──────────────────
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const projects = readData(PROJECTS_FILE);
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Also remove all tasks belonging to this project
    const tasks = readData(TASKS_FILE);
    const remainingTasks = tasks.filter(t => t.projectId !== id);

    writeData(PROJECTS_FILE, filtered);
    writeData(TASKS_FILE, remainingTasks);

    res.json({ message: 'Project and its tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', message: err.message });
  }
});

module.exports = router;
