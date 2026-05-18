/**
 * TaskFlow - Dashboard Page
 */

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertTriangle, ListTodo, Flame } from 'lucide-react';
import { getStats, getTasks, toggleTask, deleteTask, createTask, updateTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

export default function Dashboard({ projects }) {
  const [stats,         setStats]         = useState(null);
  const [recentTasks,   setRecentTasks]   = useState([]);
  const [showModal,     setShowModal]     = useState(false);
  const [editingTask,   setEditingTask]   = useState(null);
  const [loading,       setLoading]       = useState(true);

  // Load stats and recent tasks on first render
  useEffect(() => {
    loadData();
  }, []);

  // Fetch dashboard data from the backend API
  const loadData = async () => {
    try {
      setLoading(true);
      // Parallel requests for efficiency
      const [statsData, tasksData] = await Promise.all([getStats(), getTasks()]);
      setStats(statsData);
      // Show only the 5 most recent tasks on the dashboard
      setRecentTasks(tasksData.slice(0, 5));
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion and refresh data
  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      await loadData(); // Refresh stats and list
    } catch {
      toast.error('Failed to update task');
    }
  };

  // Delete a task with confirmation
  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      await loadData();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Create or update a task from the modal
  const handleSaveTask = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success('Task updated!');
      } else {
        await createTask(data);
        toast.success('Task created!');
      }
      setShowModal(false);
      setEditingTask(null);
      await loadData();
    } catch {
      toast.error('Failed to save task');
    }
  };

  // Open edit modal with task data pre-filled
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Stat card definitions — each maps to an API stats field
  const statCards = stats ? [
    { label: 'Total Tasks',   value: stats.total,       color: '#4A90D9', bg: '#EBF4FF', icon: <ListTodo size={18} color="#4A90D9" /> },
    { label: 'Completed',     value: stats.completed,   color: '#27AE60', bg: '#EAFAF1', icon: <CheckCircle size={18} color="#27AE60" /> },
    { label: 'Pending',       value: stats.pending,     color: '#E67E22', bg: '#FEF9E7', icon: <Clock size={18} color="#E67E22" /> },
    { label: 'Overdue',       value: stats.overdue,     color: '#E74C3C', bg: '#FDEDEC', icon: <AlertTriangle size={18} color="#E74C3C" /> },
    { label: 'High Priority', value: stats.highPriority,color: '#9B59B6', bg: '#F5EEF8', icon: <Flame size={18} color="#9B59B6" /> },
  ] : [];

  if (loading) return <div className="page-content"><p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p></div>;

  return (
    <div className="page-content">

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        {statCards.map(card => (
          <div className="stat-card" key={card.label}>
            <div className="stat-icon" style={{ background: card.bg }}>
              {card.icon}
            </div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Tasks ── */}
      <div className="section-header">
        <h2>Recent Tasks</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowModal(true); }}>
          <Plus size={15} /> Add Task
        </button>
      </div>

      {recentTasks.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={40} />
          <p>No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {recentTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              projects={projects}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Task Create/Edit Modal ── */}
      {showModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onSave={handleSaveTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}
