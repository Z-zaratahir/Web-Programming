# PropCRM - Real Estate Lead Management System

A comprehensive Lead Management System built with Next.js, featuring Role-Based Access Control, Real-time Updates, Lead Scoring, and AI-powered follow-up suggestions.

## Features Implemented

1. **Authentication & Security**
   - JWT-based authentication
   - Secure bcrypt password hashing
   - Strict Route Protection (Admins cannot access agent routes, agents cannot access admin routes)
   - HTTPOnly cookies
   - API Rate Limiting (50 req/min for agents, unlimited for admins)

2. **Lead Management (CRUD)**
   - Complete CRUD operations for leads
   - Auto-scoring middleware based on budget:
     - > 20M = High Priority
     - 10M - 20M = Medium Priority
     - < 10M = Low Priority
   - Real-time status tracking and updating

3. **Communication & Notifications**
   - WhatsApp click-to-chat integration (opens WhatsApp web/app with the lead's number)
   - Automated Email Notifications (Nodemailer) for new leads and assignments
   - Real-time in-app notification system with polling

4. **Analytics & Dashboard**
   - Real-time statistics cards
   - Recharts visual data (Pie charts, Bar charts, Line charts)
   - Agent performance tracking and conversion rates

5. **Follow-ups & Audit Trail**
   - Smart categorized follow-up system (Overdue, Upcoming, Stale)
   - Comprehensive Activity Timeline tracking all changes (status changes, assignments, notes)

6. **Bonus Features**
   - Excel & PDF Export functionality
   - Rule-based AI Follow-up Suggestion engine

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory (`my-app/`) with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/realestate-crm

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_key_here

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Running the Application
Make sure you have MongoDB running locally on port 27017, or update the `MONGODB_URI` to your cloud instance.

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

### 3. Usage Guide
1. Go to `http://localhost:3000/signup`
2. Create an **Admin** account first to access the master dashboard.
3. Create an **Agent** account.
4. Log in as the Admin to create leads and assign them to the agent.
5. Watch the real-time notifications and timeline updates!
