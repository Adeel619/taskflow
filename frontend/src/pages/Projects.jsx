/**
 * TaskFlow - Projects Page
 */

import { useState, useEffect } from 'react';
import { Plus, FolderKanban, Pencil, Trash2 } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, getTasks } from '../services/api';
import ProjectModal from '../components/ProjectModal';
import toast from 'react-hot-toast';

export default function Projects({ onNavigate, onProjectsChange }) {
  const [projects,     setProjects]     = useState([]);
  const [taskCounts,   setTaskCounts]   = useState({});
  const [showModal,    setShowModal]    = useState(false);
  const [editingProj,  setEditingProj]  = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => { loadData(); }, []);

  // Load projects and compute per-project task counts
  const loadData = async () => {
    try {
      setLoading(true);
      const [projs, tasks] = await Promise.all([getProjects(), getTasks()]);
      setProjects(projs);

      // Count tasks per project ID
      const counts = {};
      tasks.forEach(t => {
        if (t.projectId) counts[t.projectId] = (counts[t.projectId] || 0) + 1;
      });
      setTaskCounts(counts);

      // Notify parent so sidebar updates
      if (onProjectsChange) onProjectsChange(projs);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingProj) {
        await updateProject(editingProj.id, data);
        toast.success('Project updated!');
      } else {
        await createProject(data);
        toast.success('Project created!');
      }
      setShowModal(false);
      setEditingProj(null);
      await loadData();
    } catch { toast.error('Failed to save project'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      await loadData();
    } catch { toast.error('Failed to delete project'); }
  };

  if (loading) return <div className="page-content"><p style={{ color: 'var(--text-muted)' }}>Loading projects...</p></div>;

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>Projects</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditingProj(null); setShowModal(true); }}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={40} />
          <p>No projects yet. Create your first project board!</p>
        </div>
      ) : (
        /* Responsive grid: 3 cols → 2 cols → 1 col */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {projects.map(project => (
            <div key={project.id}
              className="card"
              style={{ padding: '20px', cursor: 'pointer', borderTop: `4px solid ${project.color}` }}
              onClick={() => onNavigate(`project-${project.id}`)}
            >
              {/* Project header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', flex: 1, marginRight: '8px' }}>
                  {project.name}
                </h3>
                {/* Edit and delete — stop propagation to avoid navigating */}
                <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => { setEditingProj(project); setShowModal(true); }}>
                    <Pencil size={14} />
                  </button>
                  <button className="btn-icon" style={{ color: 'var(--red)' }}
                    onClick={() => handleDelete(project.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {project.description && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {project.description}
                </p>
              )}

              {/* Task count badge */}
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {taskCounts[project.id] || 0} task{taskCounts[project.id] !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal project={editingProj} onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingProj(null); }} />
      )}
    </div>
  );
}
