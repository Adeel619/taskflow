/**
 * TaskFlow - Sidebar Component
 * Main navigation panel showing app logo, page links, and project list.
 */

import { LayoutDashboard, CheckSquare, FolderKanban, X } from 'lucide-react';

export default function Sidebar({ projects, activePage, onNavigate, isOpen, onClose }) {
  // Handle navigation: set page and close sidebar on mobile
  const navigate = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Dark overlay — shown behind sidebar on mobile when open */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* ── Logo ── */}
        <div className="sidebar-logo">
          <CheckSquare size={24} />
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          {/* ── Main Navigation ── */}
          <div className="sidebar-nav-label">Main</div>

          <button
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`nav-item ${activePage === 'all-tasks' ? 'active' : ''}`}
            onClick={() => navigate('all-tasks')}
          >
            <CheckSquare size={18} />
            All Tasks
          </button>

          {/* ── Projects Section ── */}
          <div className="sidebar-nav-label" style={{ marginTop: '8px' }}>Projects</div>

          <button
            className={`nav-item ${activePage === 'projects' ? 'active' : ''}`}
            onClick={() => navigate('projects')}
          >
            <FolderKanban size={18} />
            All Projects
          </button>

          {/* Render a nav item for each project with its color dot */}
          {projects.map(project => (
            <button
              key={project.id}
              className={`nav-item ${activePage === `project-${project.id}` ? 'active' : ''}`}
              onClick={() => navigate(`project-${project.id}`)}
            >
            
              <span className="project-dot" style={{ background: project.color }} />
              {/* Truncate long project names */}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.name}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
