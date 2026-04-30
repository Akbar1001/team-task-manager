import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🎯 Team Task Manager
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
          <Link to="/projects" className="nav-link">
            📁 Projects
          </Link>
          <Link to="/tasks" className="nav-link">
            ✅ Tasks
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
