# Testing Guide - Task 3 Login System

## ✅ Current Status
Both servers are running and connected to MongoDB Atlas:
- **my-implementation**: Running on port 3000 (student code)
- **ai-implementation**: Running on port 3001 (AI code with bcrypt)

## 🌐 Testing with HTML Forms

### Current Setup
All HTML forms are configured to connect to **my-implementation (port 3000)** by default.

### How to Test my-implementation (Port 3000)

1. **Open the Login Page**
   - Navigate to: `http://localhost:3000/html/webite.html`
   - Or just open: `html/webite.html` in your browser

2. **Create an Account**
   - Click "Sign up now" or go directly to `html/signup.html`
   - Enter a username and password
   - Click Submit
   - You'll be redirected to the login page

3. **Login**
   - Enter your username and password
   - Click Submit
   - You'll be redirected to the homepage (dashboard)

4. **Logout**
   - Click the logout icon in the navigation bar
   - You'll be redirected back to the login page

### How to Test ai-implementation (Port 3001)

To test the AI implementation with bcrypt password hashing:

**Option 1: Change Form Action URLs**
Edit the HTML files and change port 3000 to 3001:
- In `html/webite.html`: Change `http://localhost:3000/` to `http://localhost:3001/`
- In `html/signup.html`: Change `http://localhost:3000/` to `http://localhost:3001/`
- In `html/homepage.html`: Change logout link from `http://localhost:3000/logout` to `http://localhost:3001/logout`

**Option 2: Access Directly**
- Open: `http://localhost:3001/html/webite.html`
- The forms will still submit to port 3000 unless you modify them

## 🔑 Key Differences Between Implementations

### my-implementation (Port 3000)
- Simple lowercase code style
- Plain text passwords (NOT secure - for learning only)
- Minimal error handling
- Basic redirects

### ai-implementation (Port 3001)
- Professional code with comments
- Bcrypt password hashing (secure)
- Comprehensive error handling
- HTTP status codes (400, 401, 500)
- JSON error responses

## 📝 Test Scenarios

1. **Register a new user**: `username: john, password: 123456`
2. **Try registering the same user again**: Should show error
3. **Login with correct credentials**: Should redirect to homepage
4. **Try login with wrong password**: Should show error
5. **Access dashboard without login**: Should be blocked by middleware
6. **Logout**: Should clear session and redirect to login

## 🗄️ Database Check
- Open MongoDB Compass
- Connect to: `mongodb+srv://admin:admin123456789@cluster0.2fnyrro.mongodb.net/`
- Navigate to `studentDB` → `users` collection
- You'll see all registered users

## ⚠️ Important Notes
- Keep both servers running (don't close the terminals)
- my-implementation stores passwords as plain text
- ai-implementation stores hashed passwords (more secure)
- Sessions expire after 1 hour
- Both implementations use the same database (studentDB)
