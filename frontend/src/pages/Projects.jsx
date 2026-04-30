import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Projects.css';

function Projects({ user }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setProjects([data.data, ...projects]);
        setFormData({ name: '', description: '' });
        setShowCreateModal(false);
      } else {
        setError(data.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p._id !== projectId));
      } else {
        setError(data.message || 'Failed to delete project');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + New Project
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  rows="4"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description || 'No description'}</p>
              <div className="project-members">
                <p>👥 {project.members?.length || 0} members</p>
              </div>
              <div className="project-actions">
                <button
                  className="btn btn-small"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No projects yet. Create one to get started! 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
