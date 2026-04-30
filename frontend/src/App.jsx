import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch current user
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
        <main className={isAuthenticated ? 'main-content' : 'auth-main'}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Signup onSignup={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/projects"
              element={
                isAuthenticated ? (
                  <Projects user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                isAuthenticated ? (
                  <ProjectDetail user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/tasks"
              element={
                isAuthenticated ? (
                  <Tasks user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
