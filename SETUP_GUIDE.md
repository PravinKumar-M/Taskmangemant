# Student Task Management System - Complete Setup Guide

A full-stack web application for managing student tasks with admin and student roles.

## 📋 Project Overview

This is a complete Student Task Management System built with:
- **Frontend**: React.js with Vite
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT with localStorage

## 🛠️ Installation Steps

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL Server
- Git (optional)

### Step 1: Setup Database

1. Open MySQL Command Line or MySQL Workbench
2. Run the SQL commands from `database.sql`:

```sql
CREATE DATABASE IF NOT EXISTS student_task_system;
USE student_task_system;

-- Run all commands from database.sql file
```

Or use command line:
```bash
mysql -u root -p < database.sql
```

### Step 2: Setup Backend Server

Navigate to server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Configure environment variables in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_task_system
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server runs on: `http://localhost:5000`

### Step 3: Setup Frontend Client

In a new terminal, navigate to client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

Visit: `http://localhost:5173`

## 👤 Demo Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Student Account
- Email: `student@example.com`
- Password: `student123`

## 📁 Project Structure

```
├── client/                    # Frontend React App
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── SubmissionCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .gitignore
│
└── server/                    # Backend Express App
    ├── controllers/          # Business logic
    │   ├── authController.js
    │   ├── taskController.js
    │   └── submissionController.js
    ├── routes/              # API routes
    │   ├── authRoutes.js
    │   ├── taskRoutes.js
    │   └── submissionRoutes.js
    ├── middleware/          # Custom middleware
    │   └── authMiddleware.js
    ├── models/              # Database models
    │   └── db.js
    ├── server.js           # Main server file
    ├── package.json
    ├── .env
    └── .gitignore
```

## 🔐 API Endpoints

### Authentication Routes

**POST** `/api/auth/register`
- Register new user
- Body: `{ name, email, password }`
- Response: User ID

**POST** `/api/auth/login`
- Login user
- Body: `{ email, password }`
- Response: JWT token + user details

### Task Routes

**GET** `/api/tasks`
- Get all tasks
- Response: Array of tasks

**GET** `/api/tasks/:id`
- Get task by ID
- Response: Task details

**POST** `/api/tasks` (Admin only)
- Create new task
- Body: `{ title, description }`
- Response: Task ID

### Submission Routes

**POST** `/api/submissions` (Student only)
- Submit task answer
- Body: `{ task_id, answer }`
- Response: Success message

**GET** `/api/submissions/admin/all` (Admin only)
- Get all student submissions
- Response: Array of submissions with student info

**GET** `/api/submissions/my/submissions` (Student only)
- Get own submissions
- Response: Array of student's submissions

**PUT** `/api/submissions/:id` (Admin only)
- Grade submission
- Body: `{ marks, feedback }`
- Response: Success message

## 📊 Database Schema

### Users Table
```sql
- id (INT, PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- role (ENUM: student, admin)
- created_at
- updated_at
```

### Tasks Table
```sql
- id (INT, PRIMARY KEY)
- title (VARCHAR)
- description (LONGTEXT)
- created_at
- updated_at
```

### Submissions Table
```sql
- id (INT, PRIMARY KEY)
- task_id (INT, FOREIGN KEY)
- student_id (INT, FOREIGN KEY)
- answer (LONGTEXT)
- marks (INT, nullable)
- feedback (LONGTEXT, nullable)
- submitted_at
- updated_at
```

## 🎯 Features

### Student Features
✅ User Registration
✅ Login with email and password
✅ View all available tasks
✅ Submit answers for tasks
✅ View submitted tasks history
✅ View marks and feedback from admin
✅ Responsive dashboard

### Admin Features
✅ Admin login
✅ Create new tasks
✅ View all student submissions
✅ Grade submissions with marks and feedback
✅ View graded submissions
✅ Task management dashboard
✅ Student performance tracking

### Security Features
✅ Password hashing using bcryptjs
✅ JWT authentication
✅ Protected routes
✅ Role-based access control
✅ Token stored in localStorage
✅ Automatic logout on token expiration

## 🎨 UI Features

✅ Modern responsive design
✅ Beautiful gradient color scheme
✅ Smooth animations and transitions
✅ Mobile-friendly layout
✅ Interactive forms with validation
✅ Loading states
✅ Success/Error alerts
✅ Hover effects on cards and buttons
✅ Clean typography
✅ Professional dashboard layout

## 🧪 API Testing Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "student123"
  }'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

### Create Task (Admin)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Task",
    "description": "Task description here"
  }'
```

### Submit Task (Student)
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "task_id": 1,
    "answer": "Your answer here"
  }'
```

### Get Submissions (Admin)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/submissions/admin/all
```

### Grade Submission (Admin)
```bash
curl -X PUT http://localhost:5000/api/submissions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "marks": 85,
    "feedback": "Great work!"
  }'
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
- Verify MySQL is running
- Check `.env` credentials match your MySQL setup
- Ensure database is created
- Check if port 3306 is accessible

### CORS Error
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Default: `http://localhost:5173`

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Dependencies

### Backend
- express: Web framework
- mysql2: MySQL database driver
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- dotenv: Environment variables
- cors: Cross-origin resource sharing

### Frontend
- react: UI library
- react-dom: React DOM rendering
- react-router-dom: Routing
- axios: HTTP client
- vite: Build tool

## 🚀 Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```

Build output: `client/dist`

## 📝 Environment Variables

### Server `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_task_system
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secret_key_min_32_characters
CORS_ORIGIN=https://yourdomain.com
```

### Client `.env`
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 💡 Tips & Best Practices

1. **Never commit `.env` files** - Use `.env.example` instead
2. **Change JWT_SECRET** - Use a long random string in production
3. **Use HTTPS** - Always use HTTPS in production
4. **Database backups** - Regularly backup your database
5. **Rate limiting** - Add rate limiting to API routes
6. **Input validation** - Always validate user input
7. **Security headers** - Add security headers in production

## 📞 Support

For issues or questions, please check:
1. Check error messages in browser console
2. Check server logs in terminal
3. Verify database connection
4. Check API endpoints are correct
5. Verify JWT tokens are being sent

## 📄 License

This project is provided as-is for educational purposes.

---

**Happy Coding! 🎉**
