# Hospital ERP - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
Make sure you have installed:
- ✅ Node.js (v18+) - [Download](https://nodejs.org/)
- ✅ MongoDB (v6+) - [Download](https://www.mongodb.com/try/download/community)
- ✅ Redis (v7+) - [Download](https://redis.io/download)

### Step 1: Clone and Navigate
```bash
cd hospital_ERP
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings (optional for local development)
# The defaults work for local MongoDB and Redis
```

**Important:** Make sure MongoDB and Redis are running!

```bash
# Start MongoDB (if not running)
# On macOS:
brew services start mongodb-community

# On Ubuntu/Linux:
sudo systemctl start mongod

# On Windows:
# MongoDB should start automatically as a service

# Start Redis (if not running)
# On macOS:
brew services start redis

# On Ubuntu/Linux:
sudo systemctl start redis

# On Windows with WSL:
sudo service redis-server start
```

Now start the backend:
```bash
# Development mode with auto-reload
npm run dev

# You should see:
# 🚀 Server running in development mode on port 5000
# MongoDB Connected: localhost
# Redis Client Ready
```

Backend is now running at: `http://localhost:5000`

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev

# You should see:
# - ready started server on 0.0.0.0:3000
```

Frontend is now running at: `http://localhost:3000`

### Step 4: Access the Application

1. **Open your browser:** `http://localhost:3000`
2. **You'll be redirected to the login page**

### Step 5: Create First Admin User

Since this is a fresh installation, you need to create your first admin user.

**Option A: Using MongoDB Directly**

```bash
# Open MongoDB shell
mongosh

# Switch to database
use hospital_erp

# Create admin user
db.staffs.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@hospital.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWmKt8hm", // admin123
  phone: "+1234567890",
  dateOfBirth: new Date("1990-01-01"),
  gender: "Male",
  employeeId: "EMP001",
  department: "Administration",
  designation: "System Administrator",
  role: "Super Admin",
  salary: 100000,
  joiningDate: new Date(),
  isActive: true,
  status: "Active",
  permissions: ["all"],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option B: Using the Register API**

First, temporarily comment out the auth middleware in `backend/src/routes/auth/authRoutes.js`:

```javascript
// Comment this line temporarily
// router.use(protect);

// Then you can access the register endpoint without auth
router.post('/register', restrictTo('Super Admin', 'Admin'), register);
```

Then use this curl command or Postman:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@hospital.com",
    "password": "admin123",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "department": "Administration",
    "designation": "System Administrator",
    "role": "Super Admin",
    "salary": 100000,
    "employeeId": "EMP001"
  }'
```

**Don't forget to uncomment the middleware after creating the admin!**

### Step 6: Login

Now you can login with:
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

### 🎉 You're All Set!

You should now see the dashboard with:
- Statistics cards
- Recent appointments
- Quick actions
- Department overview

## 📁 Project Structure Overview

```
hospital_ERP/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth, validation
│   │   ├── config/      # Database, Redis
│   │   └── services/    # Helper services
│   └── package.json
│
├── frontend/            # Next.js + React
│   ├── src/
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # React components
│   │   ├── contexts/   # Global state
│   │   ├── services/   # API calls
│   │   └── lib/        # Utilities
│   └── package.json
│
└── README.md           # Full documentation
```

## 🧪 Test the API

**Health Check:**
```bash
curl http://localhost:5000/api/v1/health
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123"}'
```

**Get Patients (requires token):**
```bash
curl http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
sudo systemctl start mongod
```

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Start Redis service
```bash
sudo systemctl start redis
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using the port
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Frontend Not Loading
**Solution:** Make sure backend is running and CORS is configured correctly in `.env`

## 📚 Next Steps

1. **Explore the Dashboard** - Navigate through different sections
2. **Create Patients** - Test the patient management module
3. **Add Doctors** - Set up doctor profiles
4. **Read API Docs** - Check `API_DOCUMENTATION.md`
5. **Customize** - Modify the code to fit your needs

## 🆘 Need Help?

- **Full Documentation:** See `README.md`
- **API Reference:** See `API_DOCUMENTATION.md`
- **Issues:** Create an issue on GitHub

## 🚀 Production Deployment

For production deployment, see the detailed deployment section in `README.md`.

Key points:
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Set up proper MongoDB authentication
- Configure Redis password
- Use HTTPS
- Set up proper CORS origins
- Enable rate limiting
- Set up monitoring and logging

---

**Happy Coding! 🎉**
