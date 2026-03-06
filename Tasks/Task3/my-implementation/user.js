const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const usermodel = mongoose.model('users', userschema);

class user {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    try {
      const existinguser = await usermodel.findOne({ 
        username: this.username,
        password: this.password 
      });
      if (existinguser) {
        return { success: false, message: 'user already exists' };
      }
      const newuser = new usermodel({
        username: this.username,
        password: this.password
      });
      await newuser.save();
      return { success: true, message: 'user registered successfully' };
    } catch (error) {
      return { success: false, message: 'registration failed' };
    }
  }

  async login() {
    try {
      const founduser = await usermodel.findOne({ 
        username: this.username, 
        password: this.password 
      });
      if (founduser) {
        return { success: true, message: 'login successful', user: founduser };
      }
      return { success: false, message: 'invalid username or password' };
    } catch (error) {
      return { success: false, message: 'login failed' };
    }
  }
}

module.exports = user;
