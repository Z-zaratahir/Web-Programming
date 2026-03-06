# Login System - Setup Instructions

## 📋 What You Have

✅ **my-implementation** (Student Code - Port 3000)
   - Simple structure, lowercase naming, no comments
   - Basic security (plain text passwords)
   
✅ **ai-implementation** (AI Code - Port 3001)
   - Advanced structure, camelCase, detailed comments  
   - Better security (bcrypt password hashing)

---

## 🔧 Installation Steps

### Step 1: Install MongoDB Server

1. Download from: https://www.mongodb.com/try/download/community
2. Run installer and choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. Finish installation (MongoDB will start automatically)

### Step 2: Install Node Packages

Open two terminals in VS Code:

**Terminal 1 - Student Implementation:**
```bash
cd "my-implementation"
npm install
```

**Terminal 2 - AI Implementation:**
```bash
cd "ai-implementation"
npm install
```

---

## 🚀 Running the Servers

### Student Code (Port 3000):
```bash
cd my-implementation
npm start
```

### AI Code (Port 3001):
```bash
cd ai-implementation
npm start
```

**Both can run at the same time!**

---

## 🧪 Testing with Postman

### 1. Register a User

**Method:** POST  
**URL:** `http://localhost:3000/register`  
**Body (JSON):**
```json
{
  "username": "john",
  "password": "123456"
}
```

**Expected Response:**
```
user registered successfully
```

---

### 2. Login

**Method:** POST  
**URL:** `http://localhost:3000/login`  
**Body (JSON):**
```json
{
  "username": "john",
  "password": "123456"
}
```

**Expected Response:**
```
login successful
```

---

### 3. Access Dashboard (Protected)

**Method:** GET  
**URL:** `http://localhost:3000/dashboard`  
**No body needed**

**Expected Response:**
```
welcome john
```

**Note:** You must login first in the same Postman session!

---

### 4. Logout

**Method:** GET  
**URL:** `http://localhost:3000/logout`

**Expected Response:**
```
logout successful
```

---

## 🔍 View Database in Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Find database: `studentDB`
4. Find collection: `users`
5. You'll see your registered users!

---

## ⚖️ Key Differences

| Feature | Student Code (3000) | AI Code (3001) |
|---------|-------------------|---------------|
| **Naming** | lowercase, no underscores | camelCase |
| **Comments** | None | Detailed |
| **Security** | Plain text password | Bcrypt hashing |
| **Error Handling** | Basic | Advanced |
| **Response Format** | Simple text | JSON objects |

---

## 📸 Screenshots for Submission

Take screenshots of:
1. ✅ Postman POST /register response
2. ✅ Postman POST /login response  
3. ✅ Postman GET /dashboard response
4. ✅ Postman GET /logout response
5. ✅ MongoDB Compass showing users collection

---

## 🐛 Troubleshooting

**Error: "database connection failed"**
- Make sure MongoDB Server is installed and running
- Check Windows Services for "MongoDB" service

**Error: "Cannot find module"**
- Run `npm install` in the project folder

**Error: "Port already in use"**
- Close other running Node servers
- Or change PORT in .env file

---

## 📦 Project Structure

```
Task3/
├── my-implementation/          (Student Code)
│   ├── server.js              (Main server)
│   ├── user.js                (User class)
│   ├── database.js            (MongoDB connection)
│   ├── middleware.js          (Auth protection)
│   ├── package.json           (Dependencies)
│   └── .env                   (Config)
│
├── ai-implementation/          (AI Code)
│   ├── server.js              (Main server with comments)
│   ├── User.js                (User class with bcrypt)
│   ├── database.js            (Enhanced connection)
│   ├── middleware.js          (Better auth)
│   ├── package.json           (More dependencies)
│   └── .env                   (Config)
│
└── html/                       (Your frontend)
    ├── signup.html             (Will connect later)
    ├── webite.html             (Will connect later)
    └── homepage.html           (Will connect later)
```

---

## ✅ Next Steps

1. Install MongoDB Server
2. Run `npm install` in both folders
3. Start both servers
4. Test with Postman
5. Take screenshots
6. Later: Connect HTML forms

---

## 🎯 Git Commits (For Submission)

After everything works, commit with these messages:

```bash
git init
git add .
git commit -m "Initial project setup with Express server"
git commit -m "Added MongoDB connection using Mongoose"
git commit -m "Created User class with register method"
git commit -m "Implemented login route with session"
git commit -m "Added dashboard protected route"
git commit -m "Implemented logout functionality"
```

---

**Ready to test! Install MongoDB and run `npm install` in both folders.**
