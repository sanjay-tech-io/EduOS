# EduOS - AI Powered College Operating System

<p align="center">
  <img src="https://img.shields.io/badge/EduOS-v2.0.0-purple.svg" alt="Version">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/MySQL-Database-00758F.svg" alt="MySQL">
</p>

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| Axios | HTTP Client |
| Chart.js | Data Visualization |
| TailwindCSS | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MySQL | Database |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| OpenAI | AI Integration |

---

## 📋 Features

### 👨‍🎓 Student
- Dashboard with attendance & marks charts
- View attendance by subject
- View marks with grade calculation
- Read circulars
- AI Assistant for academic help

### 👨‍🏫 Faculty
- Create & manage classrooms
- Enroll students
- Mark attendance
- Enter marks

### 👨‍💼 Admin
- System analytics dashboard
- Post circulars
- View all users

---

## 🛠️ Installation

### 1. MySQL Setup

**Option A: Run SQL Script**
```bash
# Open MySQL
mysql -u root -p

# Run the database script
SOURCE c:/Users/ADMIN/Desktop/EduOS/database.sql;
```

**Option B: Database auto-creates on server start**

The backend automatically creates all tables when it connects to MySQL.

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eduos_db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

### 4. Start Backend
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📁 Project Structure

```
EduOS/
├── backend/
│   ├── config/db.js          # Database config
│   ├── middleware/auth.js     # JWT auth
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── classrooms.js
│   │   ├── circulars.js
│   │   ├── ai.js
│   │   ├── analytics.js
│   │   └── users.js
│   ├── .env                # Environment
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   │   ├── student/
│   │   │   ├── faculty/
│   │   │   ├── admin/
│   │   │   └── common/
│   │   ├── services/       # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── database.sql            # MySQL setup script
└── README.md
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Classrooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classrooms` | Get classrooms |
| POST | `/api/classrooms` | Create classroom |
| GET | `/api/classrooms/:id` | Get details |
| POST | `/api/classrooms/:id/enroll` | Enroll student |
| POST | `/api/classrooms/:id/attendance` | Mark attendance |
| POST | `/api/classrooms/:id/marks` | Enter marks |

### Circulars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/circulars` | Get circulars |
| POST | `/api/circulars` | Create circular |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/assistant` | Ask AI |

---

## 🗄️ Database Schema

```sql
users (id, name, email, password, role, department, year)
classrooms (id, subject_name, faculty_id, description)
enrollments (id, student_id, classroom_id)
attendance (id, student_id, classroom_id, date, status)
marks (id, student_id, classroom_id, internal_marks, test_marks)
circulars (id, title, description, target_role, priority)
```

---

## 🔧 Troubleshooting

### MySQL Connection Error
- Verify credentials in `.env`
- Ensure MySQL is running
- Check database exists

### Port Already in Use
```bash
# Kill process on port
netstat -ano | findstr :5000
taskkill /pid <PID> /f
```

---

## 📝 License

MIT License - EduOS Team 2026

---

## 🌟 Ready to Use!

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000

Register as Student, Faculty, or Admin and explore the features!
