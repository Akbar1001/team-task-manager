# Team Task Manager - API Documentation

## 🔐 Authentication Endpoints

### Signup
**POST** `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

### Login
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/api/auth/me`
- **Header:** `Authorization: Bearer {token}`

### Logout
**POST** `/api/auth/logout`
- **Header:** `Authorization: Bearer {token}`

---

## 📁 Project Endpoints

### Get All Projects
**GET** `/api/projects`
- **Header:** `Authorization: Bearer {token}`
- Returns projects where user is owner or member

### Get Single Project
**GET** `/api/projects/:id`
- **Header:** `Authorization: Bearer {token}`

### Create Project
**POST** `/api/projects`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "name": "Project Name",
  "description": "Project Description"
}
```

### Update Project
**PUT** `/api/projects/:id`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "name": "New Name",
  "description": "New Description",
  "status": "Active" // or "Archived"
}
```

### Delete Project
**DELETE** `/api/projects/:id`
- **Header:** `Authorization: Bearer {token}`
- Only project owner can delete

### Add Member to Project
**POST** `/api/projects/:id/members`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "email": "member@example.com",
  "role": "Member" // or "Admin"
}
```

### Remove Member from Project
**DELETE** `/api/projects/:id/members/:memberId`
- **Header:** `Authorization: Bearer {token}`
- Only project owner can remove members

---

## ✅ Task Endpoints

### Get Project Tasks
**GET** `/api/tasks/project/:projectId`
- **Header:** `Authorization: Bearer {token}`
- **Query Params:** 
  - `status=Todo|In Progress|Done`
  - `priority=Low|Medium|High`
  - `sortBy=createdAt|dueDate|priority`

### Get Single Task
**GET** `/api/tasks/:id`
- **Header:** `Authorization: Bearer {token}`

### Create Task
**POST** `/api/tasks`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "project": "project_id",
  "assignee": "user_id_optional",
  "priority": "Medium", // or "Low", "High"
  "dueDate": "2024-12-31"
}
```

### Update Task
**PUT** `/api/tasks/:id`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "title": "Updated Title",
  "status": "In Progress", // Todo, In Progress, Done
  "priority": "High",
  "assignee": "user_id",
  "dueDate": "2024-12-31"
}
```

### Delete Task
**DELETE** `/api/tasks/:id`
- **Header:** `Authorization: Bearer {token}`

### Add Comment
**POST** `/api/tasks/:id/comments`
- **Header:** `Authorization: Bearer {token}`
```json
{
  "text": "Comment text here"
}
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Overview
**GET** `/api/tasks/dashboard/overview`
- **Header:** `Authorization: Bearer {token}`
- Returns: Total tasks, completed, in progress, overdue, completion rate, assigned tasks

---

## 🔍 Filtering & Sorting

### Task Filters
- **Status:** `Todo`, `In Progress`, `Done`
- **Priority:** `Low`, `Medium`, `High`
- **Assigned to current user:** `/api/tasks/assigned`

### Sorting Options
- `createdAt` (default)
- `dueDate`
- `priority`

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

---

## 🔐 Authorization Rules

**Public Routes:**
- POST `/api/auth/signup`
- POST `/api/auth/login`

**Protected Routes (require JWT token):**
- All routes in `/api/projects`
- All routes in `/api/tasks`
- All routes in `/api/auth` except signup and login

**Admin Access:**
- Update project settings (owner only)
- Remove members (owner only)
- Delete project (owner only)

---

## 🚀 Usage Example (Fetch API)

```javascript
// 1. Signup
const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'pass123',
    confirmPassword: 'pass123'
  })
});
const { token } = await signupRes.json();

// 2. Create Project
const projectRes = await fetch('http://localhost:5000/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Project',
    description: 'Project description'
  })
});
const { data: project } = await projectRes.json();

// 3. Create Task
const taskRes = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Task',
    project: project._id,
    priority: 'High'
  })
});
```
