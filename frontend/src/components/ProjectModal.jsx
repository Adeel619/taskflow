/**
 * TaskFlow - Project Modal Component
 * Modal for creating or editing a project board.
 *
 */

import { useState } from 'react';

// Color palette for project boards
const COLOR_OPTIONS = [
  '#4A90D9', '#27AE60', '#E67E22', '#9B59B6',
  '#E74C3C', '#1ABC9C', '#F39C12', '#2C3E50',
];

export default function ProjectModal({ project, onSave, onClose }) {
  const [name,        setName]        = useState(project?.name        || '');
  const [description, setDescription] = useState(project?.description || '');
  const [color,       setColor]       = useState(project?.color       || COLOR_OPTIONS[0]);
  const [error,       setError]       = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    onSave({ name: name.trim(), description, color });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{project ? 'Edit Project' : 'New Project'}</h2>

        {error && (
          <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <div className="form-group">
          <label>Project Name *</label>
          <input
            type="text" placeholder="e.g. University Assignments"
            value={name} onChange={e => setName(e.target.value)} autoFocus
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="What is this project about?"
            value={description} onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Color picker */}
        <div className="form-group">
          <label>Color</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: c, border: color === c ? '3px solid var(--navy)' : '2px solid transparent',
                  cursor: 'pointer', outline: 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
