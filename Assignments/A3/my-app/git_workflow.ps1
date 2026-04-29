$ErrorActionPreference = "Stop"
cd "c:\Users\Zara Tahir\University\Sem 6\Web Programming"

# 1. Base Setup
git checkout -b feature/project-setup
git add "Assignments/A3/my-app/package.json" "Assignments/A3/my-app/package-lock.json" "Assignments/A3/my-app/tsconfig.json" "Assignments/A3/my-app/tailwind.config.ts" "Assignments/A3/my-app/postcss.config.mjs" "Assignments/A3/my-app/eslint.config.mjs" "Assignments/A3/my-app/next.config.ts" "Assignments/A3/my-app/next-env.d.ts" "Assignments/A3/my-app/.gitignore" "Assignments/A3/my-app/.env.example" "Assignments/A3/my-app/app/layout.tsx" "Assignments/A3/my-app/app/globals.css"
git commit -m "Initializing core Next.js configuration and UI styling framework"
git checkout main
git merge feature/project-setup

# 2. Database
git checkout -b feature/database
git add "Assignments/A3/my-app/lib/mongodb.ts" "Assignments/A3/my-app/lib/models"
git commit -m "Configuring MongoDB connection and Mongoose schemas"
git checkout main
git merge feature/database

# 3. Authentication
git checkout -b feature/authentication
git add "Assignments/A3/my-app/lib/jose.ts" "Assignments/A3/my-app/proxy.ts" "Assignments/A3/my-app/app/api/auth" "Assignments/A3/my-app/app/login" "Assignments/A3/my-app/app/signup"
git commit -m "Implementing secure JWT authentication and login endpoints"
git checkout main
git merge feature/authentication

# 4. Role-Based Access Control
git checkout -b feature/role-based-access
git add "Assignments/A3/my-app/app/admin/layout.tsx" "Assignments/A3/my-app/app/agent/layout.tsx"
git commit -m "Enforcing role-based routing for admin and agent portals"
git checkout main
git merge feature/role-based-access

# 5. Lead Management
git checkout -b feature/lead-management
git add "Assignments/A3/my-app/app/api/leads" "Assignments/A3/my-app/app/admin/leads" "Assignments/A3/my-app/app/agent/leads"
git commit -m "Developing lead CRUD operations and scoring mechanisms"
git checkout main
git merge feature/lead-management

# 6. Analytics Dashboard
git checkout -b feature/analytics-dashboard
git add "Assignments/A3/my-app/app/api/analytics" "Assignments/A3/my-app/app/admin/dashboard" "Assignments/A3/my-app/app/agent/dashboard"
git commit -m "Creating data analytics dashboard with Recharts"
git checkout main
git merge feature/analytics-dashboard

# 7. Real-Time Updates & Follow-ups
git checkout -b feature/real-time-updates
git add "Assignments/A3/my-app/app/api/notifications" "Assignments/A3/my-app/app/api/agents" "Assignments/A3/my-app/components" "Assignments/A3/my-app/app/admin/followups" "Assignments/A3/my-app/app/agent/followups"
git commit -m "Adding notification polling and follow-up tracking system"
git checkout main
git merge feature/real-time-updates

# 8. Remaining UI Polish
git checkout -b feature/ui-polishing
git add "Assignments/A3"
git commit -m "Finalizing layout adjustments and documentation assets"
git checkout main
git merge feature/ui-polishing

Write-Host "Git workflow complete!"
