# How to View Your Database

## Method 1: MongoDB Compass (Recommended)

1. **Open MongoDB Compass** (you already have it installed)

2. **Connection String**: Paste this in the connection field:
   ```
   mongodb+srv://admin:admin123456789@cluster0.2fnyrro.mongodb.net/
   ```

3. **Click Connect**

4. **Navigate to your data**:
   - Look for database: `studentDB`
   - Click on collection: `users`
   - You'll see all registered users here

5. **What you'll see**:
   - In `my-implementation` users: passwords are plain text
   - In `ai-implementation` users: passwords are hashed (start with `$2b$`)

## Method 2: MongoDB Atlas Web Interface

1. **Go to**: https://cloud.mongodb.com/

2. **Login** with your MongoDB Atlas account

3. **Click on your cluster**: Cluster0

4. **Click "Browse Collections"** button

5. **Navigate**: studentDB → users

6. **View your data** in the web browser

## Quick Database Check

After you register a user, you should see entries like:

**my-implementation (plain password)**:
```json
{
  "_id": "...",
  "username": "john",
  "password": "123456"
}
```

**ai-implementation (bcrypt hashed)**:
```json
{
  "_id": "...",
  "username": "sarah",
  "password": "$2b$10$AbC123..."
}
```
