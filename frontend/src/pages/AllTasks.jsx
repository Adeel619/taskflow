/**
 * TaskFlow - All Tasks Page
 */

import { useState, useEffect } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

// Filter options for the filter bar
const STATUS_FILTERS   = ['All', 'Pending', 'Completed', 'Overdue'];
const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low'];

export default function AllTasks({ projects }) {
  const [tasks,        setTasks]        = useState([]);
  const [showModal,    setShowModal]    = useState(false);
  const [editingTask,  setEditingTask]  = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [prioFilter,   setPrioFilter]   = useState('All');
  const [loading,      setLoading]      = useState(true);

  // Load tasks on mount
  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      await loadTasks();
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      await loadTasks();
    } catch { toast.error('Failed to delete task'); }
  };

  const handleSave = async (data) => {
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
      await loadTasks();
    } catch { toast.error('Failed to save task'); }
  };

 
  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < now;

    // Status filter logic
    if (statusFilter === 'Pending'   && (task.completed || isOverdue)) return false;
    if (statusFilter === 'Completed' && !task.completed) return false;
    if (statusFilter === 'Overdue'   && !isOverdue) return false;

    // Priority filter logic
    if (prioFilter !== 'All' && task.priority !== prioFilter.toLowerCase()) return false;

    return true;
  });

  if (loading) return <div className="page-content"><p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p></div>;

  return (
    <div className="page-content">

      {/* ── Header ── */}
      <div className="section-header">
        <h2>All Tasks <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({filteredTasks.length})</span></h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowModal(true); }}>
          <Plus size={15} /> Add Task
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>STATUS</div>
        <div className="filter-bar" style={{ marginBottom: '10px' }}>
          {STATUS_FILTERS.map(f => (
            <button key={f} className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>PRIORITY</div>
        <div className="filter-bar">
          {PRIORITY_FILTERS.map(f => (
            <button key={f} className={`filter-btn ${prioFilter === f ? 'active' : ''}`}
              onClick={() => setPrioFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* ── Task List ── */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={40} />
          <p>No tasks match your filters.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} projects={projects}
              onToggle={handleToggle} onEdit={(t) => { setEditingTask(t); setShowModal(true); }}
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
