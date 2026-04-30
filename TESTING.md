# 🧪 Testing Guide - Team Task Manager

Complete guide to test all features of the Team Task Manager application.

## ✅ Pre-Test Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB Atlas account created
- [ ] Environment variables configured
- [ ] Dependencies installed (npm install)
- [ ] Both servers ready to start

## 🚀 Starting the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm install    # First time only
npm run dev    # Development mode with hot-reload
```

Expected output:
```
Server running on port 5000
✓ Database connected successfully (or gracefully handling connection)
```

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm install    # First time only
npm run dev    # Start Vite dev server
```

Expected output:
```
VITE v8.0.10  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Terminal 3: Monitor Backend (Optional)

```bash
cd backend
tail -f server.log  # Or watch logs in real-time
```

---

## 📋 Test Scenarios

### Test 1: Authentication - Signup

**Goal**: Create a new user account

**Steps**:
1. Open http://localhost:5173 in browser
2. Should redirect to login page
3. Click "Don't have an account? Sign up here"
4. Fill in signup form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
5. Click "Sign Up"

**Expected Results**:
- ✅ Form validates inputs
- ✅ No validation errors shown
- ✅ Redirects to dashboard
- ✅ User name shown in top right
- ✅ Navigation bar visible
- ✅ Token stored in localStorage

**Verification**:
```javascript
// In browser DevTools > Console
localStorage.getItem('token')  // Should show JWT token
```

---

### Test 2: Authentication - Login

**Goal**: Login with existing credentials

**Steps**:
1. Go to http://localhost:5173/login
2. Enter email: testuser@example.com
3. Enter password: TestPassword123
4. Click "Login"

**Expected Results**:
- ✅ Redirects to dashboard
- ✅ User information displays correctly
- ✅ Navigation shows user name
- ✅ JWT token in localStorage

---

### Test 3: Dashboard View

**Goal**: View dashboard statistics

**Steps**:
1. After login, verify on dashboard page
2. Look for statistics cards:
   - Total Tasks
   - In Progress Tasks
   - Completed Tasks
   - Overdue Tasks
3. Check for recent tasks list

**Expected Results**:
- ✅ Statistics load correctly
- ✅ Numbers display (initially may be 0)
- ✅ Recent tasks section visible
- ✅ No errors in console

---

### Test 4: Create Project

**Goal**: Create a new project

**Steps**:
1. Click "Projects" in navigation
2. Click "Create Project" button
3. Fill in form:
   - Project Name: My Awesome Project
   - Description: This is a test project
4. Click "Create"

**Expected Results**:
- ✅ Modal opens with form
- ✅ Form validates inputs
- ✅ Project appears in projects list
- ✅ Success message shown (if implemented)
- ✅ Project card shows name and description

---

### Test 5: View Project Details

**Goal**: View project and manage members

**Steps**:
1. Click on a project in projects list
2. View project details page
3. Look for members section
4. Check for add member button

**Expected Results**:
- ✅ Project name and description display
- ✅ Project owner shown
- ✅ Members list visible
- ✅ Add member form available

---

### Test 6: Create Task

**Goal**: Create a task in a project

**Steps**:
1. On Projects page, click on a project
2. Look for "Create Task" button
3. Fill in task form:
   - Title: My First Task
   - Description: Test task creation
   - Priority: High
   - Due Date: 2024-12-31
4. Click "Create Task"

**Expected Results**:
- ✅ Task appears in task list
- ✅ Task shows correct details
- ✅ Status defaults to "Todo"
- ✅ Priority badge displays correct color

---

### Test 7: Update Task Status

**Goal**: Change task status through workflow

**Steps**:
1. View tasks for a project
2. Find the "My First Task" created earlier
3. Click on task
4. Change status from "Todo" → "In Progress"
5. Change status from "In Progress" → "Done"

**Expected Results**:
- ✅ Task status updates immediately
- ✅ Completed task moves to "Done" section
- ✅ Dashboard statistics update
- ✅ Status change reflected in task details

---

### Test 8: Filter Tasks

**Goal**: Test task filtering functionality

**Steps**:
1. On Tasks page, look for filter buttons
2. Click "In Progress" filter
3. Verify only "In Progress" tasks show
4. Click "Done" filter
5. Verify only completed tasks show
6. Click "All" to reset

**Expected Results**:
- ✅ Filter buttons respond to clicks
- ✅ Task list updates based on filter
- ✅ Correct count of tasks in each status
- ✅ Visual feedback on active filter

---

### Test 9: Add Comment to Task

**Goal**: Add comments to tasks for collaboration

**Steps**:
1. Open a task
2. Look for comments section
3. Enter comment: "Great progress on this task!"
4. Click "Add Comment" button

**Expected Results**:
- ✅ Comment appears in task detail view
- ✅ Timestamp shows correctly
- ✅ User name shown with comment
- ✅ Comments persist on page reload

---

### Test 10: Delete Task

**Goal**: Delete a task from project

**Steps**:
1. Open a task
2. Look for "Delete" button
3. Click delete button
4. Confirm deletion if prompted

**Expected Results**:
- ✅ Task removed from list
- ✅ Confirmation dialog shown (if implemented)
- ✅ Dashboard statistics update
- ✅ Task no longer appears in filtered views

---

### Test 11: Logout

**Goal**: Test logout functionality

**Steps**:
1. Click user menu / logout button in navigation
2. Confirm logout
3. Verify redirect to login page

**Expected Results**:
- ✅ Token removed from localStorage
- ✅ Redirects to login page
- ✅ Cannot access protected routes
- ✅ Accessing /dashboard redirects to /login

---

### Test 12: Protected Routes

**Goal**: Verify unauthorized access protection

**Steps**:
1. After logout, manually clear localStorage:
   ```javascript
   localStorage.removeItem('token')
   ```
2. Try to access http://localhost:5173/dashboard
3. Try to access http://localhost:5173/projects

**Expected Results**:
- ✅ Automatically redirects to /login
- ✅ Cannot view dashboard
- ✅ Cannot view projects
- ✅ Only /login and /signup accessible

---

## 🔍 Verification Tests

### API Response Verification

**In browser DevTools Console:**

```javascript
// Test API connectivity
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

**Expected**: Returns user object with success: true

---

### Database Verification

**In MongoDB Atlas:**

1. Go to Collections
2. Look for documents in:
   - `users` collection
   - `projects` collection
   - `tasks` collection
3. Verify data matches what you created

---

### Local Storage Verification

**In DevTools > Application > Local Storage:**

```
Key: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (JWT token)

Key: user (optional)
Value: {"id": "...", "name": "...", "email": "..."}
```

---

## 📊 Performance Tests

### Response Time Measurement

```javascript
// Measure API response time
const start = Date.now();
await fetch('http://localhost:5000/api/projects');
console.log(`Response time: ${Date.now() - start}ms`);
```

**Expected**: < 500ms for local development

---

### Load Test

**Stress test with multiple operations:**

```javascript
// Create 10 tasks in sequence
for (let i = 0; i < 10; i++) {
  await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: `Task ${i + 1}`,
      description: 'Load test task',
      project: 'project_id',
      priority: 'Medium'
    })
  });
}
```

**Verify**: No crashes, all tasks created successfully

---

## 🐛 Error Handling Tests

### Test Invalid Email

**Steps**:
1. On signup page, enter: `notanemail`
2. Click signup

**Expected**: 
- ✅ Validation error: "Invalid email format"
- ✅ Form doesn't submit

---

### Test Password Mismatch

**Steps**:
1. On signup, enter different confirm password
2. Click signup

**Expected**:
- ✅ Error: "Passwords do not match"
- ✅ Form doesn't submit

---

### Test Duplicate Email

**Steps**:
1. Try to signup with same email twice

**Expected**:
- ✅ Error: "Email already exists"
- ✅ Graceful error message

---

### Test Invalid Token

**Steps**:
1. Manually modify localStorage token
2. Refresh page
3. Try to access protected route

**Expected**:
- ✅ Error handled gracefully
- ✅ Redirect to login
- ✅ Token cleared

---

## 🌐 Cross-Browser Testing

Test in multiple browsers:
- ✅ Chrome / Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Check**:
- All features work
- Styling looks consistent
- No console errors
- Forms submit correctly

---

## 📱 Responsive Design Testing

Test on different screen sizes:

```javascript
// In DevTools
// Test: 320px (Mobile)
// Test: 768px (Tablet)
// Test: 1024px (Desktop)
// Test: 1920px (Large Desktop)
```

**Verify**:
- ✅ Layout adapts to screen size
- ✅ Navigation works on mobile
- ✅ Forms are usable on small screens
- ✅ No horizontal scrolling

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

### Test Environment
- Browser: Chrome 120
- OS: Windows 11
- Backend: Running on localhost:5000
- Frontend: Running on localhost:5173

### Tests Passed
- ✅ Signup
- ✅ Login
- ✅ Create Project
- ✅ Create Task
- ✅ Update Task Status
- ✅ Logout

### Tests Failed
- ❌ Add Comment (TODO: Fix implementation)

### Issues Found
1. Issue: Comments not persisting
   Severity: Medium
   Steps: See Test 9
   
### Performance
- Average API response: 150ms
- Dashboard load time: 800ms
- No console errors

### Browser Compatibility
- Chrome: ✅ Pass
- Firefox: ✅ Pass
- Safari: ❌ Minor styling issues
```

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error

**Error**: `Access to fetch at... blocked by CORS policy`

**Solution**:
- Ensure backend has CORS enabled
- Check backend is running on :5000
- Verify API URL in frontend

### Issue: 401 Unauthorized

**Error**: `{"success": false, "message": "Not authorized"}`

**Solution**:
- Verify token in localStorage
- Check token hasn't expired (7 days)
- Re-login to get fresh token

### Issue: 404 Not Found

**Error**: `Cannot POST /api/tasks`

**Solution**:
- Ensure backend is running
- Check API endpoint path
- Verify projectId is correct

### Issue: Database Not Connected

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
- Check MongoDB Atlas credentials
- Verify IP whitelist (0.0.0.0/0)
- Test connection string in MongoDB Compass

---

## ✨ Next Steps After Testing

1. **Fix Issues**: Address any bugs found
2. **Optimize**: Improve performance
3. **Deploy**: Move to Railway
4. **Monitor**: Watch for errors in production
5. **Update**: Add more features based on feedback

---

Happy Testing! 🎉
