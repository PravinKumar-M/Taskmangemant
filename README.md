# Student Task Management System

A complete full-stack web application for managing student tasks with admin and student roles.

## 📚 Project Description

This is a professional-grade Student Task Management System built with modern technologies. Students can register, login, view tasks, submit answers, and view their grades. Admins can create tasks, view submissions, and provide grades with feedback.

## ✨ Key Features

### Student Features
- User registration and login
- View all available tasks
- Submit task answers
- View submission history
- See marks and feedback from admin
- Responsive dashboard

### Admin Features
- Admin dashboard
- Create and manage tasks
- View all student submissions
- Grade submissions with marks and feedback
- Track student performance

### Security
- Password hashing with bcryptjs
- JWT authentication
- Role-based access control
- Protected routes
- Token expiration

### UI/UX
- Modern responsive design
- Beautiful gradient theme
- Smooth animations
- Mobile-friendly layout
- Professional dashboard

## 🛠️ Tech Stack

**Frontend:**
- React.js 18+
- Vite
- React Router DOM
- Axios
- Modern CSS

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- MySQL

**Database:**
- MySQL with proper schema
- Foreign key relationships
- Indexed columns

## 📁 Project Structure

```
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/                    # Backend Express Application
│   ├── controllers/          # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Database models
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── database.sql             # Database schema and sample data
├── SETUP_GUIDE.md          # Complete setup instructions
├── QUICK_START.md          # Quick start guide
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL Server
- npm or yarn

### Installation

1. **Setup Database:**
```bash
mysql -u root -p < database.sql
# Run PowerShell as Administrator, then:
net start MySQL80
```

2. **Setup Backend:**
```bash
cd server
npm install
npm run dev
```

3. **Setup Frontend (New Terminal):**
```bash
cd client
npm install
npm run dev
```

4. **Open Browser:**
Visit `http://localhost:5173`

### Demo Credentials

**Admin:**
- Email: admin@example.com
- Password: admin123

**Student:**
- Email: student@example.com
- Password: student123

## 📖 Complete File List

### Backend Files (11 files)
- ✅ server/server.js
- ✅ server/package.json
- ✅ server/.env
- ✅ server/controllers/authController.js
- ✅ server/controllers/taskController.js
- ✅ server/controllers/submissionController.js
- ✅ server/routes/authRoutes.js
- ✅ server/routes/taskRoutes.js
- ✅ server/routes/submissionRoutes.js
- ✅ server/middleware/authMiddleware.js
- ✅ server/models/db.js

### Frontend Files (16 files)
- ✅ client/src/App.jsx
- ✅ client/src/main.jsx
- ✅ client/src/index.html
- ✅ client/src/index.css
- ✅ client/src/vite.config.js
- ✅ client/src/package.json
- ✅ client/src/.env
- ✅ client/src/pages/Login.jsx
- ✅ client/src/pages/Register.jsx
- ✅ client/src/pages/StudentDashboard.jsx
- ✅ client/src/pages/AdminDashboard.jsx
- ✅ client/src/pages/NotFound.jsx
- ✅ client/src/components/Navbar.jsx
- ✅ client/src/components/TaskCard.jsx
- ✅ client/src/components/SubmissionCard.jsx
- ✅ client/src/services/api.js

### CSS Files (7 files)
- ✅ client/src/styles/Navbar.css
- ✅ client/src/styles/Auth.css
- ✅ client/src/styles/Dashboard.css
- ✅ client/src/styles/TaskCard.css
- ✅ client/src/styles/SubmissionCard.css
- ✅ client/src/styles/NotFound.css
- ✅ client/src/index.css

### Configuration Files
- ✅ database.sql
- ✅ SETUP_GUIDE.md
- ✅ QUICK_START.md
- ✅ README.md
- ✅ .gitignore

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task (Admin)

### Submissions
- `POST /api/submissions` - Submit task (Student)
- `GET /api/submissions/admin/all` - Get all submissions (Admin)
- `GET /api/submissions/my/submissions` - Get my submissions (Student)
- `PUT /api/submissions/:id` - Grade submission (Admin)

## 💻 System Requirements

### Development
- Node.js 14+
- npm 6+
- MySQL 5.7+
- 500MB disk space

### Runtime
- 512MB RAM minimum
- 1GB disk space
- Internet connection for CDN

## 📝 Features Implemented

### Authentication ✅
- User registration
- Email validation
- Password hashing
- JWT token generation
- Token refresh
- Auto logout

### Student Dashboard ✅
- View available tasks
- Submit task answers
- View submission history
- See marks and feedback
- Responsive layout

### Admin Dashboard ✅
- Create tasks
- View submissions
- Grade submissions
- Add feedback
- Track performance

### UI/UX ✅
- Gradient theme
- Responsive design
- Mobile optimization
- Smooth animations
- Loading states
- Error handling

## 🎓 Learning Outcomes

This project demonstrates:
- React hooks and component composition
- React Router navigation
- State management with hooks
- Axios HTTP client
- Express.js REST API
- JWT authentication
- MySQL database design
- Password hashing
- Responsive CSS design
- Error handling
- Form validation

## 🚀 Production Deployment

### Backend Deployment
1. Change `.env` variables for production
2. Update JWT_SECRET to a strong key
3. Deploy to Heroku, DigitalOcean, or AWS
4. Setup MySQL database in production

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist` folder to Netlify, Vercel, or S3
3. Update `VITE_API_URL` to production API URL

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting steps.

## 📞 Support

For issues:
1. Check the error message in browser console
2. Check server logs in terminal
3. Verify database connection
4. Verify JWT tokens
5. Check API endpoints

## 📄 License

This project is provided for educational purposes.

## 🙏 Credits

Built with ❤️ using React, Express, and MySQL.

---

**Ready to use! Start building today! 🚀**
