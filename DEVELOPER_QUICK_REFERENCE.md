# 🚀 Developer Quick Reference

Fast lookup guide for common tasks and commands.

---

## ⚡ Quick Commands

### Setup (First Time)
```bash
# Database
mysql -u root -p < database.sql

# Backend
cd server && npm install && npm run dev

# Frontend (new terminal)
cd client && npm install && npm run dev
```

### Running (Next Times)
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Building for Production
```bash
# Backend
npm start

# Frontend
npm run build
```

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Base | http://localhost:5000/api |

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Student | student@example.com | student123 |

---

## 📡 Common API Calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@test.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get Tasks
```bash
curl http://localhost:5000/api/tasks
```

### Submit Task (replace TOKEN and TASK_ID)
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"task_id":1,"answer":"Your answer here"}'
```

### Get My Submissions (replace TOKEN)
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/submissions/my/submissions
```

---

## 🗂️ Project Structure

```
├── client/               Frontend React app
│   ├── src/
│   │   ├── pages/       Page components
│   │   ├── components/  Reusable components
│   │   ├── services/    API functions
│   │   └── styles/      CSS files
│   └── package.json
│
├── server/              Backend Express app
│   ├── controllers/     Business logic
│   ├── routes/         API endpoints
│   ├── middleware/      Auth logic
│   ├── models/         Database
│   └── package.json
│
└── database.sql         Database schema
```

---

## 💾 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_task_system
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Authentication

**Token Expiry:** 7 days
**Storage:** localStorage
**Header:** `Authorization: Bearer TOKEN`

---

## 📊 Database Tables

### users
- id (PK), name, email, password, role, created_at, updated_at

### tasks
- id (PK), title, description, created_at, updated_at

### submissions
- id (PK), task_id (FK), student_id (FK), answer, marks, feedback, submitted_at, updated_at

---

## 🎯 Common Fixes

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
1. Check MySQL is running
2. Verify `.env` credentials
3. Create database: `mysql -u root -p < database.sql`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Token Expired
- Auto logout on 401 response
- User redirected to login
- Clear localStorage and login again

---

## 📝 File Locations

| File | Location |
|------|----------|
| Server Config | `server/.env` |
| Frontend Config | `client/.env` |
| Database Schema | `database.sql` |
| API Doc | `API_DOCUMENTATION.md` |
| Setup Guide | `SETUP_GUIDE.md` |
| Quick Start | `QUICK_START.md` |

---

## 🔄 API Endpoints Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /auth/register | No | - |
| POST | /auth/login | No | - |
| GET | /tasks | No | - |
| GET | /tasks/:id | No | - |
| POST | /tasks | Yes | admin |
| POST | /submissions | Yes | student |
| GET | /submissions/admin/all | Yes | admin |
| GET | /submissions/my/submissions | Yes | student |
| PUT | /submissions/:id | Yes | admin |

---

## 🎨 Color Scheme

- **Primary Gradient:** #667eea → #764ba2
- **Success:** #d4edda (#155724 text)
- **Error:** #f8d7da (#721c24 text)
- **Warning:** #fff3cd (#856404 text)
- **Dark:** #2c3e50

---

## 🧪 Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] View tasks as student
- [ ] Submit task answer
- [ ] View submission history
- [ ] Login as admin
- [ ] Create new task
- [ ] View student submissions
- [ ] Grade submission
- [ ] View feedback as student
- [ ] Test logout
- [ ] Test 404 page
- [ ] Test mobile responsive
- [ ] Test form validation
- [ ] Test error alerts

---

## 📦 npm Commands

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start with auto-reload
npm start               # Start production
npm list                # List dependencies
```

### Frontend
```bash
npm install             # Install dependencies
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview build
npm list               # List dependencies
```

---

## 🔧 Configuration Files

### vite.config.js
```javascript
{
  port: 5173,
  open: true
}
```

### server.js
```javascript
const PORT = process.env.PORT || 5000
app.listen(PORT)
```

---

## 🚨 Important Notes

⚠️ **Change JWT_SECRET before production**
⚠️ **Never commit .env files**
⚠️ **Use HTTPS in production**
⚠️ **Backup database regularly**
⚠️ **Use strong admin password**

---

## 📞 Support Resources

- **Setup Issues:** See `SETUP_GUIDE.md`
- **Quick Setup:** See `QUICK_START.md`
- **API Details:** See `API_DOCUMENTATION.md`
- **Complete List:** See `PROJECT_DELIVERY_SUMMARY.md`
- **Verification:** See `IMPLEMENTATION_CHECKLIST.md`

---

## ✅ Pre-Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Update CORS_ORIGIN
- [ ] Setup database backup
- [ ] Test all features
- [ ] Check error logs
- [ ] Verify HTTPS
- [ ] Setup monitoring
- [ ] Document deployment steps

---

## 🎓 Quick Learning

**React Concepts:**
- useState hooks
- useEffect hooks
- React Router
- Axios interceptors
- Component composition

**Express Concepts:**
- Routes and middleware
- Controllers and models
- Error handling
- Authentication
- Authorization

**MySQL Concepts:**
- Schema design
- Foreign keys
- Indexes
- Relationships

---

## 💾 Backup Commands

### Database Backup
```bash
mysqldump -u root -p student_task_system > backup.sql

# Restore
mysql -u root -p student_task_system < backup.sql
```

### Project Backup
```bash
# Windows
xcopy . backup\ /S /I

# Mac/Linux
cp -r . ../backup/
```

---

## 🌐 Domain Setup (Production)

1. Update `CORS_ORIGIN` in backend `.env`
2. Update `VITE_API_URL` in frontend `.env`
3. Build frontend: `npm run build`
4. Deploy to hosting
5. Setup SSL certificate
6. Configure domain DNS

---

## 📊 Performance Tips

**Frontend:**
- Lazy load images
- Code splitting
- Minimize bundle size
- Cache static assets

**Backend:**
- Use connection pooling
- Add database indexes
- Enable gzip compression
- Implement caching

---

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting added
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure headers

---

## 📈 Monitoring

**Recommended Tools:**
- PM2 (process manager)
- NewRelic (monitoring)
- DataDog (logging)
- Sentry (error tracking)
- CloudFlare (CDN)

---

**Last Updated:** January 2024
**Version:** 1.0
