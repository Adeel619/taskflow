/**
 * TaskFlow - Root Application Component
 * Manages top-level state: page navigation, project list, sidebar toggle.
 * Uses simple state-based routing for this single-page application.
 */

import { useState, useEffect } from 'react';
import { Menu, CheckSquare } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { getProjects } from './services/api';

import Sidebar       from './components/Sidebar';
import Dashboard     from './pages/Dashboard';
import AllTasks      from './pages/AllTasks';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

import './index.css';

export default function App() {
  const [activePage,  setActivePage]  = useState('dashboard');
  const [projects,    setProjects]    = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load all projects on startup so sidebar & dropdowns are populated
  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
  }, []);

  const getPageTitle = () => {
    if (activePage === 'dashboard') return 'Dashboard';
    if (activePage === 'all-tasks') return 'All Tasks';
    if (activePage === 'projects')  return 'Projects';
    if (activePage.startsWith('project-')) {
      const id = activePage.replace('project-', '');
      return projects.find(p => p.id === id)?.name || 'Project';
    }
    return 'TaskFlow';
  };

  const renderPage = () => {
    if (activePage === 'dashboard') return <Dashboard projects={projects} />;
    if (activePage === 'all-tasks') return <AllTasks projects={projects} />;
    if (activePage === 'projects')  return <Projects onNavigate={setActivePage} onProjectsChange={setProjects} />;
    if (activePage.startsWith('project-')) {
      const project = projects.find(p => p.id === activePage.replace('project-', ''));
      if (!project) return <div className="page-content"><p>Project not found.</p></div>;
      return <ProjectDetail project={project} projects={projects} onNavigate={setActivePage} />;
    }
    return <Dashboard projects={projects} />;
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="app-layout">
        <Sidebar
          projects={projects}
          activePage={activePage}
          onNavigate={setActivePage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <header className="top-header">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h1>{getPageTitle()}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={18} color="var(--accent)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>TaskFlow</span>
            </div>
          </header>
          {renderPage()}
        </div>
      </div>
    </>
  );
}
