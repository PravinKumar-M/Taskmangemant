# 📡 API Documentation

Complete API reference for Student Task Management System

---

## Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://your-domain.com/api`

---

## Authentication

### Header Format
All authenticated requests must include:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration
- **Expiry:** 7 days
- **Format:** JWT
- **Storage:** localStorage (client-side)

---

## API Endpoints

### 🔐 Authentication Routes

#### 1. Register User
```
POST /auth/register
```

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Validation Rules:**
- Name: Required, min 2 characters
- Email: Required, valid email format, unique
- Password: Required, min 6 characters

---

#### 2. Login User
```
POST /auth/login
```

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Token Storage:**
```javascript
// Client automatically stores:
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

---

### 📚 Task Routes

#### 3. Get All Tasks
```
GET /tasks
```

**Description:** Retrieve all available tasks (public endpoint)

**Authentication:** Not required

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "title": "Introduction to Databases",
      "description": "Explain the basic concepts...",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "SQL Query Writing",
      "description": "Write SQL queries...",
      "created_at": "2024-01-16T11:20:00Z"
    }
  ]
}
```

**Sample cURL:**
```bash
curl http://localhost:5000/api/tasks
```

---

#### 4. Get Task by ID
```
GET /tasks/:id
```

**Description:** Retrieve a specific task by ID

**Parameters:**
- `id` (URL param): Task ID (required)

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Introduction to Databases",
    "description": "Explain the basic concepts of relational databases...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Sample cURL:**
```bash
curl http://localhost:5000/api/tasks/1
```

---

#### 5. Create Task (Admin Only)
```
POST /tasks
```

**Description:** Create a new task

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "title": "New Database Task",
  "description": "Complete description of the task here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "taskId": 5
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**Validation Rules:**
- Title: Required, min 5 characters
- Description: Required, min 20 characters

**Sample cURL:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Task",
    "description": "Task description here"
  }'
```

---

### ✅ Submission Routes

#### 6. Submit Task (Student Only)
```
POST /submissions
```

**Description:** Submit an answer for a task

**Authentication:** Required (Student role)

**Request Body:**
```json
{
  "task_id": 1,
  "answer": "Your answer or solution here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task submitted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide task_id and answer"
}
```

**Notes:**
- Can update existing submission
- Marks become null after update
- Feedback is preserved

**Sample cURL:**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "task_id": 1,
    "answer": "Your comprehensive answer here"
  }'
```

---

#### 7. Get All Submissions (Admin Only)
```
GET /submissions/admin/all
```

**Description:** Retrieve all student submissions

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "submissions": [
    {
      "id": 1,
      "task_id": 1,
      "student_id": 2,
      "answer": "Database explanation...",
      "marks": 85,
      "feedback": "Good work!",
      "student_name": "John Doe",
      "student_email": "john@example.com",
      "task_title": "Introduction to Databases",
      "submitted_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

**Sample cURL:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/submissions/admin/all
```

---

#### 8. Get My Submissions (Student Only)
```
GET /submissions/my/submissions
```

**Description:** Retrieve logged-in student's submissions

**Authentication:** Required (Student role)

**Success Response (200):**
```json
{
  "success": true,
  "submissions": [
    {
      "id": 1,
      "task_id": 1,
      "student_id": 2,
      "answer": "My answer here",
      "marks": 85,
      "feedback": "Good work!",
      "task_title": "Introduction to Databases",
      "task_description": "Explain databases...",
      "submitted_at": "2024-01-20T14:30:00Z"
    },
    {
      "id": 2,
      "task_id": 2,
      "student_id": 2,
      "answer": "SQL queries...",
      "marks": null,
      "feedback": null,
      "task_title": "SQL Query Writing",
      "task_description": "Write SQL queries...",
      "submitted_at": "2024-01-21T15:45:00Z"
    }
  ]
}
```

**Note:**
- `marks` is `null` if not graded yet
- `feedback` is `null` if not graded yet

**Sample cURL:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/submissions/my/submissions
```

---

#### 9. Grade Submission (Admin Only)
```
PUT /submissions/:id
```

**Description:** Add marks and feedback to a submission

**Authentication:** Required (Admin role)

**Parameters:**
- `id` (URL param): Submission ID (required)

**Request Body:**
```json
{
  "marks": 90,
  "feedback": "Excellent work! Your explanation was clear and comprehensive."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Submission updated successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Submission not found"
}
```

**Validation Rules:**
- Marks: Required, number 0-100
- Feedback: Required, min 10 characters

**Sample cURL:**
```bash
curl -X PUT http://localhost:5000/api/submissions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "marks": 90,
    "feedback": "Excellent work!"
  }'
```

---

## 🔄 Request/Response Examples

### Full Login Flow Example

**1. Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "secure123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secure123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "student"
  }
}
```

**3. Use Token for Authenticated Request:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/submissions/my/submissions
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 Authentication Flow

```
1. User submits credentials to /auth/login
   ↓
2. Server verifies password with bcryptjs
   ↓
3. Server generates JWT token (valid 7 days)
   ↓
4. Client stores token in localStorage
   ↓
5. Client includes token in Authorization header
   ↓
6. Server verifies token in middleware
   ↓
7. Request proceeds or denied
```

---

## 📊 Data Models

### User Model
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "role": "student",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Task Model
```json
{
  "id": 1,
  "title": "Introduction to Databases",
  "description": "Explain the basic concepts...",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Submission Model
```json
{
  "id": 1,
  "task_id": 1,
  "student_id": 2,
  "answer": "Database explanation...",
  "marks": 85,
  "feedback": "Good work!",
  "submitted_at": "2024-01-20T14:30:00Z",
  "updated_at": "2024-01-20T14:30:00Z"
}
```

---

## 🎯 Common Use Cases

### Scenario 1: Student Submits Task

```javascript
// 1. Get all tasks
GET /tasks

// 2. Submit answer
POST /submissions
Body: { task_id: 1, answer: "My answer" }

// 3. Check submission status
GET /submissions/my/submissions

// 4. View marks and feedback (after admin grades)
GET /submissions/my/submissions
```

### Scenario 2: Admin Grades Submissions

```javascript
// 1. View pending submissions
GET /submissions/admin/all

// 2. Grade a submission
PUT /submissions/1
Body: { marks: 85, feedback: "Good work" }

// 3. Verify update
GET /submissions/admin/all
```

### Scenario 3: Admin Creates Task

```javascript
// 1. Create task
POST /tasks
Body: { title: "New Task", description: "..." }

// 2. Verify creation
GET /tasks

// 3. Students can now see and submit
```

---

## 🧪 Testing with Postman

1. **Set up Postman:**
   - Import these endpoints
   - Create collection for API

2. **Set up Variables:**
   - `base_url`: http://localhost:5000/api
   - `token`: (empty initially)
   - `admin_token`: (empty initially)

3. **Test Flow:**
   - Register user
   - Login (save token)
   - Create task (as admin)
   - Submit task (as student)
   - Grade submission (as admin)

---

## 🔗 API Interceptors (Client-Side)

Axios automatically:
- Adds Authorization header with token
- Removes token on 401 response
- Redirects to login on 401

---

## 📝 Rate Limiting (Recommended)

For production, add rate limiting:
```javascript
// Recommended: 100 requests per 15 minutes per IP
const rateLimit = require('express-rate-limit');
```

---

## 🚀 Production Considerations

1. **HTTPS Required** - Use SSL/TLS
2. **CORS Configuration** - Restrict to frontend domain
3. **Rate Limiting** - Prevent abuse
4. **Input Sanitization** - Prevent injection
5. **Logging** - Track all requests
6. **Monitoring** - Alert on errors
7. **Database Backups** - Regular backups
8. **Secret Management** - Use secure vaults

---

## 📞 Support

For API issues:
1. Check error message in response
2. Verify token is valid
3. Check request body format
4. Verify user role
5. Check database connection

---

**Last Updated:** January 2024
**API Version:** 1.0
