/**
 * TaskFlow - Backend Server
 * Entry point for the Node.js/Express REST API
 * Handles all task and project CRUD operations
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

// ─── Ensure data directory exists on startup (Windows fix) ─
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
['tasks.json','projects.json'].forEach(f => {
  const fp = path.join(DATA_DIR, f);
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, '[]', 'utf-8');
});

// Import route handlers
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
// Enable Cross-Origin Resource Sharing so React frontend can communicate
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ─── API Routes ───────────────────────────────────────────

app.use('/api/tasks', taskRoutes);


app.use('/api/projects', projectRoutes);

// ─── Health Check ─────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow API is running', timestamp: new Date() });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});


app.listen(PORT, () => {
  console.log(`TaskFlow API server running on http://localhost:${PORT}`);
});

module.exports = app;
