const express = require('express');
const session = require('express-session');
const path = require('path');
const connectdb = require('./database');
const user = require('./user');
const authmiddleware = require('./middleware');

const app = express();
const port = 3000;

connectdb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));

app.use(session({
  secret: 'mysecretkey123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const newuser = new user(username, password);
  const result = await newuser.register();
  if (result.success) {
    req.session.user = username;
    res.redirect('/html/homepage.html');
  } else {
    const loginattempt = await newuser.login();
    if (loginattempt.success) {
      req.session.user = username;
      res.redirect('/html/homepage.html');
    } else {
      res.redirect('/html/signup.html?error=exists');
    }
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const loginuser = new user(username, password);
  const result = await loginuser.login();
  if (result.success) {
    // Create session for logged-in user
    req.session.user = username;
    res.redirect('/html/homepage.html');
  } else {
    res.redirect('/html/webite.html?error=invalid');
  }
});

// Protected dashboard route - requires authentication
app.get('/dashboard', authmiddleware, (req, res) => {
  res.send(`welcome ${req.session.user}`);
});

// Logout route - destroy session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('logout failed');
    } else {
      res.redirect('/html/webite.html');
    }
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
