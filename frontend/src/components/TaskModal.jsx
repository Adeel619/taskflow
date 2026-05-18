/**
 * TaskFlow - TaskModal Component
 */

import { useState } from 'react';

export default function TaskModal({ task, projects, onSave, onClose }) {
  // Pre-fill form with existing task values when editing
  const [title,       setTitle]       = useState(task?.title       || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority,    setPriority]    = useState(task?.priority    || 'medium');
  const [dueDate,     setDueDate]     = useState(task?.dueDate     || '');
  const [projectId,   setProjectId]   = useState(task?.projectId   || '');
  const [error,       setError]       = useState('');

  // Handle form submission with basic validation
  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    onSave({ title: title.trim(), description, priority, dueDate: dueDate || null, projectId: projectId || null });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop click from bubbling to overlay (would close modal) */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>

        {/* Error message */}
        {error && (
          <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Add more details (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Priority + Due Date side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Project assignment */}
        <div className="form-group">
          <label>Project</label>
          <select value={projectId} onChange={e => setProjectId(e.target.value)}>
            <option value="">No Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
