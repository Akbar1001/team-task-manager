import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    assignedTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Here's your project overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.totalTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completedTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgressTasks}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdueTasks}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Progress Overview</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <p className="progress-text">{stats.completionRate}% Complete</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Assigned Tasks</h2>
        </div>
        {stats.assignedTasks.length > 0 ? (
          <div className="tasks-list">
            {stats.assignedTasks.map(task => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="task-project">📁 {task.project?.name}</p>
                </div>
                <span className={`task-priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No tasks assigned to you yet</p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Dashboard;
