# 🎯 Team Task Manager - Full Stack Application

A modern, full-stack web application for managing team projects and tasks with role-based access control, real-time collaboration, and comprehensive dashboard analytics.

## 🚀 Features

- ✅ **User Authentication**: Secure signup and login with JWT tokens
- ✅ **Project Management**: Create, update, and manage team projects
- ✅ **Task Management**: Create, assign, and track task progress
- ✅ **Team Collaboration**: Add team members and manage permissions
- ✅ **Dashboard**: Real-time analytics and task overview
- ✅ **Status Tracking**: Todo, In Progress, Done status management
- ✅ **Priority Levels**: Low, Medium, High priority tasks
- ✅ **Due Dates**: Track overdue tasks
- ✅ **Role-Based Access**: Admin and Member roles
- ✅ **Comments**: Add comments to tasks for collaboration

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **Styling**: CSS3
- **State Management**: React Hooks

## 📂 Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── projectController.js  # Project logic
│   │   └── taskController.js     # Task logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Project.js           # Project schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── projectRoutes.js     # Project endpoints
│   │   └── taskRoutes.js        # Task endpoints
│   ├── .env                     # Environment variables
│   ├── server.js                # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navigation.jsx    # Navigation bar
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Signup.jsx        # Signup page
    │   │   ├── Dashboard.jsx     # Dashboard
    │   │   ├── Projects.jsx      # Projects list
    │   │   ├── ProjectDetail.jsx # Project details
    │   │   └── Tasks.jsx         # Tasks page
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── styles/
    │   │   ├── Auth.css          # Auth pages styling
    │   │   ├── Dashboard.css     # Dashboard styling
    │   │   ├── Navigation.css    # Navigation styling
    │   │   ├── Projects.css      # Projects styling
    │   │   └── Tasks.css         # Tasks styling
    │   ├── App.jsx               # Main app component
    │   ├── App.css               # Global styles
    │   └── main.jsx              # Entry point
    ├── package.json
    └── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick API Examples

**Signup**
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Project**
```bash
POST http://localhost:5000/api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

**Create Task**
```bash
POST http://localhost:5000/api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Task",
  "description": "Task description",
  "project": "project_id",
  "priority": "High",
  "dueDate": "2024-12-31"
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['Admin', 'Member'],
  avatar: String,
  isActive: Boolean,
  timestamps: true
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: ['Admin', 'Member']
  }],
  status: ['Active', 'Archived'],
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignee: ObjectId (User),
  createdBy: ObjectId (User),
  status: ['Todo', 'In Progress', 'Done'],
  priority: ['Low', 'Medium', 'High'],
  dueDate: Date,
  isOverdue: Boolean,
  comments: [{
    user: ObjectId (User),
    text: String,
    createdAt: Date
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  timestamps: true
}
```

## 🔐 Authentication & Authorization

- **JWT Token**: Issued on signup/login, valid for 7 days
- **Protected Routes**: All API routes except signup/login require valid JWT
- **Role-Based Access**:
  - **Admin**: Can manage project settings, add/remove members
  - **Member**: Can create tasks, view project data

## 📖 Usage Flow

1. **Signup**: Create new account
2. **Login**: Get JWT token
3. **Create Project**: Start a new project
4. **Add Members**: Invite team members via email
5. **Create Tasks**: Add tasks to project
6. **Assign Tasks**: Assign tasks to team members
7. **Update Status**: Move tasks through Todo → In Progress → Done
8. **View Dashboard**: Track overall progress

## 🚀 Deployment to Railway

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Railway deployment guide.

### Quick Deployment Steps

1. Push code to GitHub
2. Connect Railway to GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy backend and frontend services
5. Connect MongoDB Atlas
6. Monitor logs and troubleshoot

## 📝 Environment Variables

### Backend
```
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend
```
VITE_API_URL=<backend_url>
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check IP whitelist in MongoDB Atlas
- Verify credentials in .env
- Allow access from anywhere (0.0.0.0/0) for development

### CORS Error
- Backend has CORS enabled for all origins
- Check if backend is running on port 5000

### Token Not Working
- Ensure token is passed in Authorization header
- Token format: `Bearer {token}`
- Check token expiration (7 days default)

## 📄 License

MIT

## 👥 Support

For issues, questions, or suggestions, please create an issue in the repository.

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Documentation](https://react.dev)
- [JWT Authentication](https://jwt.io)
- [Railway Documentation](https://docs.railway.app)

---

**Happy Task Managing! 🚀**
