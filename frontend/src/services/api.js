// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==================== AUTH SERVICES ====================

export const authService = {
  signup: async (name, email, password, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ==================== PROJECT SERVICES ====================

export const projectService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },

  getById: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },

  create: async (name, description = '') => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  },

  update: async (projectId, name, description, status) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ name, description, status }),
    });
    return response.json();
  },

  delete: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return response.json();
  },

  addMember: async (projectId, email, role = 'Member') => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email, role }),
    });
    return response.json();
  },

  removeMember: async (projectId, memberId) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return response.json();
  },
};

// ==================== TASK SERVICES ====================

export const taskService = {
  getProjectTasks: async (projectId, status = null, priority = null, sortBy = null) => {
    let url = `${API_BASE_URL}/tasks/project/${projectId}`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (sortBy) params.append('sortBy', sortBy);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },

  getById: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },

  create: async (title, description, projectId, assignee = null, priority = 'Medium', dueDate = null) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        title,
        description,
        project: projectId,
        assignee,
        priority,
        dueDate,
      }),
    });
    return response.json();
  },

  update: async (taskId, title, description, status, priority, dueDate, assignee) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        dueDate,
        assignee,
      }),
    });
    return response.json();
  },

  delete: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return response.json();
  },

  addComment: async (taskId, text) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ text }),
    });
    return response.json();
  },

  getDashboardOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/dashboard/overview`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return response.json();
  },
};
