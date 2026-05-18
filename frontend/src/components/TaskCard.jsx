/**
 * TaskFlow - TaskCard Component
 */

import { Pencil, Trash2, Calendar } from 'lucide-react';

export default function TaskCard({ task, projects, onToggle, onEdit, onDelete }) {
  // Find the project this task belongs to (if any)
  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>

      {/* ── Completion Toggle Button ── */}
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {/* Checkmark icon shown when completed */}
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        )}
      </button>

      {/* ── Task Body ── */}
      <div className="task-body">
        <div className="task-title">{task.title}</div>

        {/* Only show description if it exists */}
        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}

      
        <div className="task-meta">
          {/* Priority badge */}
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>

          {/* Project label with its color */}
          {project && (
            <span className="badge-project" style={{ borderLeft: `3px solid ${project.color}` }}>
              {project.name}
            </span>
          )}

          {/* Due date — turns red if overdue */}
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={12} />
              {isOverdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="task-actions">
        <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task">
          <Pencil size={15} />
        </button>
        <button className="btn-icon" onClick={() => onDelete(task.id)} title="Delete task"
          style={{ color: 'var(--red)' }}>
          <Trash2 size={15} />
        </button>
      </div>

    </div>
  );
}
