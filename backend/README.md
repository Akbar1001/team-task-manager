# Team Task Manager - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example` and fill in your values:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Get MongoDB Connection String
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and database
- Get your connection string and add it to `.env`

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. API Health Check
```
GET http://localhost:5000/api/health
```

## Project Structure
- `config/` - Database configuration
- `controllers/` - Business logic
- `middleware/` - Custom middleware
- `models/` - Database schemas
- `routes/` - API routes
- `server.js` - Main entry point

## API Endpoints (Coming Next)
- Authentication routes
- Project management routes
- Task management routes
