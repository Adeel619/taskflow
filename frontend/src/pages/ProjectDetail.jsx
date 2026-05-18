/**
 * TaskFlow - Project Detail Page
 */

import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, CheckSquare } from 'lucide-react';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

export default function ProjectDetail({ project, projects, onNavigate }) {
  const [tasks,       setTasks]       = useState([]);
  const [showModal,   setShowModal]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Load tasks for this specific project on mount or when project changes
  useEffect(() => { loadTasks(); }, [project.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Pass projectId as query parameter to filter on the backend
      const data = await getTasks(project.id);
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try { await toggleTask(id); await loadTasks(); }
    catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await deleteTask(id); toast.success('Deleted'); await loadTasks(); }
    catch { toast.error('Failed to delete task'); }
  };

  const handleSave = async (data) => {
    try {
      // Auto-assign this project when creating from project detail view
      const taskData = { ...data, projectId: project.id };
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success('Task updated!');
      } else {
        await createTask(taskData);
        toast.success('Task created!');
      }
      setShowModal(false);
      setEditingTask(null);
      await loadTasks();
    } catch { toast.error('Failed to save task'); }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (loading) return <div className="page-content"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>;

  return (
    <div className="page-content">
      {/* ── Breadcrumb ── */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '16px' }}
        onClick={() => onNavigate('projects')}>
        <ArrowLeft size={14} /> Back to Projects
      </button>

      {/* ── Project Header with color strip ── */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px', borderLeft: `5px solid ${project.color}` }}>
        <h2 style={{ color: 'var(--navy)', marginBottom: '4px' }}>{project.name}</h2>
        {project.description && (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{project.description}</p>
        )}
        {/* Progress bar */}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {completedCount} of {tasks.length} tasks completed
        </div>
        {tasks.length > 0 && (
          <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.round((completedCount / tasks.length) * 100)}%`,
              height: '100%', background: project.color, borderRadius: '3px', transition: 'width 0.4s ease'
            }} />
          </div>
        )}
      </div>

      {/* ── Task List Header ── */}
      <div className="section-header">
        <h2>Tasks <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({tasks.length})</span></h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowModal(true); }}>
          <Plus size={15} /> Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={40} />
          <p>No tasks in this project yet.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} projects={projects}
              onToggle={handleToggle}
              onEdit={(t) => { setEditingTask(t); setShowModal(true); }}
              onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal task={editingTask} projects={projects}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTask(null); }} />
      )}
    </div>
  );
}
