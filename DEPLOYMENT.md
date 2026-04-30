# 🚀 Deployment Guide - Railway

Complete guide to deploy Team Task Manager to Railway.

## Prerequisites

- GitHub account with repository containing the code
- Railway account (free tier available)
- MongoDB Atlas account with database
- Domain (optional, Railway provides free domain)

## Step 1: Prepare Code for Deployment

### 1.1 Backend Configuration

Update `backend/server.js` to handle deployment:

```javascript
// The server.js already handles this correctly
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 1.2 Frontend Configuration

Create `frontend/.env.production`:
```
VITE_API_URL=<your-backend-railway-url>
```

Update `frontend/src/services/api.js` to use environment variable:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 1.3 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Team Task Manager"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Deploy Backend on Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in or create account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your GitHub account and select your repository

### 2.2 Configure Backend Service

1. **Add Service**: Click "Add Service"
2. **Select Service Type**: Choose "Node.js"
3. **Configuration**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables

In Railway dashboard → Variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=production
```

### 2.4 Deploy Backend

1. Click "Deploy" button
2. Railway will automatically build and deploy
3. Get your backend URL from Railway dashboard
4. Note this URL, you'll need it for frontend

## Step 3: Deploy MongoDB

### Option A: Use MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user
4. Get connection string
5. Whitelist Railway IP (or use 0.0.0.0/0 for development)
6. Use this connection string in `MONGODB_URI` environment variable

### Option B: Add MongoDB to Railway

1. In Railway project, click "Add Service"
2. Select "MongoDB" from service templates
3. Railway automatically creates MongoDB instance
4. Get connection string from generated variables

## Step 4: Deploy Frontend on Railway

### 4.1 Create Frontend Service

1. **Add Service**: Click "Add Service" in your Railway project
2. **Service Type**: Choose "Node.js"
3. **Configuration**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`

### 4.2 Configure Frontend Environment

In Railway dashboard → Variables (for frontend service):

```
VITE_API_URL=https://your-backend-railway-url
VITE_BACKEND_PORT=5000
```

### 4.3 Update Frontend API Service

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';
```

### 4.4 Configure Vite for Production

Ensure `frontend/vite.config.js` has proper build settings:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

## Step 5: Connect Services

### 5.1 Backend → MongoDB

1. In Railway, connect MongoDB service to backend service
2. MongoDB connection string automatically injected

### 5.2 Frontend → Backend

1. Update frontend environment variable with backend URL
2. Frontend will use `VITE_API_URL` to connect to backend

## Step 6: Configure CORS (if needed)

If you get CORS errors, your backend already has CORS configured:

```javascript
app.use(cors()); // Allows all origins
```

For production, restrict to your frontend domain:

```javascript
app.use(cors({
  origin: 'https://your-frontend-railway-url'
}));
```

## Step 7: Deploy and Test

### 7.1 Manual Deploy

1. Click "Deploy" button in Railway
2. Wait for build to complete
3. Check logs for errors
4. Access your live application

### 7.2 Test Application

1. Go to frontend URL
2. Test signup: Create new account
3. Test login: Login with created account
4. Test project creation: Create a project
5. Test task creation: Add a task to project
6. Check MongoDB: Verify data in MongoDB Atlas

### 7.3 Monitor Deployment

- Check Railway dashboard for logs
- Monitor database performance
- Track API response times
- Set up error notifications

## Step 8: Domain Configuration (Optional)

### 8.1 Using Railway Subdomain

Railway provides free subdomains:
- Backend: `backend-production.railway.app`
- Frontend: `frontend-production.railway.app`

### 8.2 Using Custom Domain

1. **Buy Domain**: From GoDaddy, Namecheap, etc.
2. **Configure DNS**: Point to Railway IP
3. **SSL Certificate**: Railway provides free SSL

#### Steps:
1. In Railway → Settings
2. Add custom domain
3. Update DNS records at your domain provider
4. Wait for propagation (5-30 minutes)

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Try local build
npm run build
```

### MongoDB Connection Error

1. Check connection string
2. Verify IP whitelist in MongoDB Atlas
3. Ensure database user credentials are correct
4. Test connection string locally

### CORS Errors

```javascript
// Add debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` is correct
2. Check backend is running
3. Verify CORS is enabled
4. Check firewall rules

### High Memory Usage

1. Reduce Node pool size
2. Enable compression
3. Cache static files
4. Optimize database queries

## Performance Optimization

### 1. Enable Gzip Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Set Up Caching

```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### 3. Database Indexing

Ensure database has proper indexes:
- User email (unique)
- Project owner
- Task project ID
- Task assignee

### 4. Frontend Optimization

- Code splitting
- Lazy loading components
- Minify CSS/JS
- Optimize images

## Monitoring & Maintenance

### 1. Set Up Logging

Use Railway logs dashboard to monitor:
- Error rates
- Response times
- Database queries

### 2. Backup Strategy

- Enable MongoDB Atlas backups
- Daily snapshots
- Test restore procedures

### 3. Update Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Test thoroughly
npm test
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables not in code
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Password hashing works
- [ ] Database backups enabled
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies up to date

## Getting Help

- Check Railway logs
- Review error messages
- Test locally first
- Consult documentation
- Join community forums

---

**Your app is now live! 🎉**

Frontend URL: `https://your-frontend-railway-url`
Backend URL: `https://your-backend-railway-url`
