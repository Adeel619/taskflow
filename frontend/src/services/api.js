/**
 * TaskFlow - API Service
 * Centralizes all HTTP communication with the Node.js/Express backend.
 * Uses Axios for clean, promise-based requests.
 */

import axios from 'axios';

// Base URL for the backend API - change this if deploying to a server
const BASE_URL = 'http://localhost:5000/api';

// Create a configured Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Projects API ─────────────────────────────────────────

/** Fetch all projects */
export const getProjects = () => api.get('/projects').then(r => r.data);

/** Create a new project */
export const createProject = (data) => api.post('/projects', data).then(r => r.data);

/** Update an existing project by ID */
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then(r => r.data);

/** Delete a project (also removes its tasks on the backend) */
export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

// ─── Tasks API ────────────────────────────────────────────

/** Fetch all tasks, optionally filtered by projectId */
export const getTasks = (projectId) => {
  const params = projectId ? { projectId } : {};
  return api.get('/tasks', { params }).then(r => r.data);
};

/** Fetch dashboard statistics: total, completed, pending, overdue, highPriority */
export const getStats = () => api.get('/tasks/stats').then(r => r.data);

/** Create a new task */
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);

/** Update a task's fields by ID */
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data);

/** Toggle a task's completed status */
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`).then(r => r.data);

/** Delete a task by ID */
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);
