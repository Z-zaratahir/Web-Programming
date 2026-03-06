# Login System with Express.js & MongoDB

A full-stack authentication system built with Express.js, MongoDB, and session-based authentication. This project demonstrates user registration, login, protected routes, and session management with both basic and advanced implementations.

## 🚀 Features

- **User Registration** - Create new accounts with username and password
- **User Login** - Authenticate with stored credentials
- **Session Management** - Persistent user sessions with express-session
- **Protected Routes** - Middleware-based route protection
- **Logout Functionality** - Secure session destruction
- **Error Handling** - User-friendly error messages
- **Auto-Login** - Seamless registration-to-login flow
- **Responsive UI** - Modern, styled interface

## 🛠️ Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **express-session** - Session middleware
- **bcrypt** - Password hashing (AI implementation)

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Client-side logic

## 📁 Project Structure

```
Task3/
├── my-implementation/          # Basic implementation
│   ├── server.js              # Express server
│   ├── user.js                # User class with register/login
│   ├── database.js            # MongoDB connection
│   ├── middleware.js          # Authentication middleware
│   └── html/                  # Frontend files
│       ├── webite.html        # Login/signup page
│       ├── homepage.html      # Protected dashboard
│       └── signup.html        # Registration page
│
├── ai-implementation/         # Advanced implementation
│   ├── server.js              # Express server with enhanced features
│   ├── User.js                # User class with bcrypt hashing
│   ├── database.js            # MongoDB connection
│   ├── middleware.js          # Authentication middleware
│   └── html/                  # Frontend files
│
├── css/                       # Shared stylesheets
│   ├── stylesheet.css
│   ├── homepage.css
│   └── signup.css
│
└── Images/                    # Static assets
```

## ⚙️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Z-zaratahir/Web-Programming.git
cd Web-Programming/Tasks/Task3
```

2. **Install dependencies for basic implementation**
```bash
cd my-implementation
npm install
```

3. **Install dependencies for AI implementation**
```bash
cd ../ai-implementation
npm install
```

4. **Configure MongoDB**
   - Update the MongoDB connection string in `database.js` with your credentials
   - Ensure your IP address is whitelisted in MongoDB Atlas

## 🚦 Running the Application

### Basic Implementation (Port 3000)
```bash
cd my-implementation
node server.js
```
Access at: `http://localhost:3000/html/webite.html`

### AI Implementation (Port 3001)
```bash
cd ai-implementation
node server.js
```
Access at: `http://localhost:3001/html/webite.html`

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login with credentials | No |
| GET | `/logout` | Destroy session | Yes |
| GET | `/dashboard` | Protected dashboard | Yes |

### Request Examples

**Register**
```javascript
POST /register
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=secret123
```

**Login**
```javascript
POST /login
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=secret123
```

## 🔒 Security Features

### Basic Implementation
- Session-based authentication
- Server-side session storage
- Protected routes with middleware
- Input validation

### AI Implementation
- All basic features plus:
- **Bcrypt password hashing** (10 salt rounds)
- Enhanced validation with Mongoose schema
- Secure cookie configuration
- Detailed error handling

## 💾 Database Schema

### Users Collection

```javascript
{
  username: String (required),
  password: String (required),
  createdAt: Date (AI implementation only),
  updatedAt: Date (AI implementation only)
}
```

## 🎨 Features Comparison

| Feature | Basic Implementation | AI Implementation |
|---------|---------------------|-------------------|
| Port | 3000 | 3001 |
| Collection | `users` | `users-through-ai` |
| Password Storage | Plain text | Bcrypt hashed |
| Documentation | Minimal | Comprehensive |
| Validation | Basic | Advanced |
| Error Messages | Simple | Detailed |

## 🔑 Environment Variables

Create a `.env` file (optional) for configuration:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

## 🧪 Testing

1. **Navigate to the login page**
2. **Register a new account**
   - Enter username and password
   - Submit form
3. **Verify auto-login**
   - Should redirect to homepage automatically
4. **Test protected routes**
   - Try accessing `/dashboard` without login
5. **Test logout**
   - Click logout button
   - Verify redirect to login page

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Zara Tahir** - [GitHub Profile](https://github.com/Z-zaratahir)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB Atlas
- Font Awesome for icons
- Mongoose ODM

---

**Note:** This project includes two implementations - a basic student implementation and an AI-enhanced version with advanced security features. Both are fully functional and demonstrate different development approaches.
