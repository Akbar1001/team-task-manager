import React, { useState, useEffect } from 'react';
import '../styles/Tasks.css';

function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // This page will be for viewing all assigned tasks
    // For now, showing placeholder
    setLoading(false);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <div className="filter-buttons">
          {['All', 'Todo', 'In Progress', 'Done'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : filteredTasks.length > 0 ? (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div key={task._id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <span className="task-status">{task.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No tasks found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default Tasks;
