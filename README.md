# Hospital ERP System

A comprehensive, full-stack Hospital Enterprise Resource Planning (ERP) system built with modern technologies to manage all aspects of hospital operations.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  TypeScript • TailwindCSS • Axios • React Query • Zustand   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────┴────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│       Authentication • Authorization • Business Logic        │
└────────┬────────────────────────────────────────┬───────────┘
         │                                        │
┌────────┴────────┐                    ┌─────────┴──────────┐
│  MongoDB        │                    │  Redis Cache       │
│  Primary DB     │                    │  Session & Queue   │
└─────────────────┘                    └────────────────────┘
```

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB
- **Cache/Queue:** Redis
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + AWS S3/Cloudinary
- **Real-time:** Socket.io
- **Validation:** Joi, express-validator
- **Logging:** Winston, Morgan
- **Security:** Helmet, express-rate-limit, mongo-sanitize

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Radix UI (ShadCN UI)
- **State Management:** Zustand
- **Data Fetching:** Axios + React Query
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner
- **Charts:** Recharts
- **Real-time:** Socket.io Client

## 📋 Features & Modules

### 1. Patient Management
- Patient registration and profiles
- Electronic Health Records (EHR)
- Appointment scheduling
- Medical history tracking
- Insurance information management
- Patient portal access

### 2. Doctor Management
- Doctor profiles and credentials
- Specialization tracking
- Shift scheduling
- Patient consultations
- Prescription generation
- Performance metrics

### 3. Pharmacy Management
- Drug inventory management
- Batch tracking with expiry dates
- Prescription fulfillment
- Low stock alerts
- Supplier management
- Sales tracking

### 4. Laboratory Department
- Lab test catalog
- Sample tracking
- Test requests and results
- Multi-parameter test results
- Report generation
- Critical value alerts

### 5. Ward/Bed Management
- Ward categorization (ICU, General, etc.)
- Real-time bed availability
- Patient admission/discharge
- Nurse allocation
- Bed transfer management

### 6. Billing & Finance
- Invoice generation
- Payment processing
- Insurance claims
- Expense tracking
- Revenue analytics
- Multiple payment modes

### 7. Staff & HR Management
- Role-based access control
- Attendance tracking
- Payroll management
- Leave management
- Performance evaluation
- Document management

### 8. Emergency Department
- Quick patient registration
- Triage management
- Queue system
- Priority-based treatment
- Critical patient tracking

### 9. Radiology/Imaging
- Imaging test scheduling
- DICOM support (planned)
- Report generation
- Image storage and sharing

### 10. Admin Panel
- User management
- System configuration
- Audit logs
- Real-time dashboards
- Analytics and reporting

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── redis.js         # Redis connection
│   │   ├── logger.js        # Winston logger
│   │   └── index.js         # Config exports
│   ├── models/              # Mongoose models
│   │   ├── patient/
│   │   │   ├── Patient.js
│   │   │   └── Appointment.js
│   │   ├── doctor/
│   │   │   └── Doctor.js
│   │   ├── pharmacy/
│   │   │   ├── Drug.js
│   │   │   └── Prescription.js
│   │   ├── laboratory/
│   │   │   └── LabTest.js
│   │   ├── ward/
│   │   │   └── Ward.js
│   │   ├── billing/
│   │   │   └── Invoice.js
│   │   └── staff/
│   │       └── Staff.js
│   ├── controllers/         # Route controllers
│   │   ├── auth/
│   │   ├── patient/
│   │   ├── doctor/
│   │   └── ...
│   ├── routes/              # API routes
│   │   ├── auth/
│   │   ├── patient/
│   │   └── index.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/            # Business logic
│   │   ├── redis/
│   │   ├── email/
│   │   └── upload/
│   ├── utils/               # Utility functions
│   ├── validators/          # Input validation
│   └── server.js            # App entry point
├── logs/                    # Application logs
├── .env.example             # Environment variables template
├── .gitignore
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── doctors/
│   │   ├── pharmacy/
│   │   └── layout.tsx
│   ├── components/          # React components
│   │   ├── auth/
│   │   ├── patient/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── services/            # API services
│   │   ├── authService.ts
│   │   └── patientService.ts
│   ├── lib/                 # Libraries
│   │   ├── axios.ts
│   │   └── utils.ts
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
│       └── globals.css
├── public/                  # Static assets
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_erp
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB:**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Start Redis:**
```bash
# Using Redis service
sudo systemctl start redis

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

6. **Start the backend server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

4. **Start the development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Default Credentials

For initial testing, you'll need to create a default admin user. You can do this via API or MongoDB directly.

**Using MongoDB:**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use hospital_erp

# Create admin user (password will be hashed on first login)
# You'll need to implement a seed script or create via API
```

**Recommended Default Credentials:**
- Email: `admin@hospital.com`
- Password: `admin123`

> **Important:** Change these credentials immediately in production!

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@hospital.com",
    "role": "Super Admin"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### Patient Endpoints

#### Get All Patients
```http
GET /patients?page=1&limit=10&search=john
Authorization: Bearer {token}
```

#### Get Single Patient
```http
GET /patients/:id
Authorization: Bearer {token}
```

#### Create Patient
```http
POST /patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

#### Update Patient
```http
PUT /patients/:id
Authorization: Bearer {token}
```

#### Delete Patient
```http
DELETE /patients/:id
Authorization: Bearer {token}
```

## 🎨 UI Components

The frontend uses **Radix UI** primitives styled with **TailwindCSS** for a modern, accessible interface.

### Key UI Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Built-in theme switching
- **Accessibility**: WCAG 2.1 compliant components
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time feedback
- **Form Validation**: Client-side and server-side validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- Rate limiting
- CORS protection
- SQL/NoSQL injection prevention
- XSS protection
- CSRF protection
- Helmet.js security headers
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment (Example: PM2)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name hospital-erp-backend

# View logs
pm2 logs hospital-erp-backend

# Monitor
pm2 monit
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Coming soon - Docker Compose configuration
```

## 📊 Database Schema

### Key Collections

1. **Staff** - System users with role-based access
2. **Patients** - Patient information and medical records
3. **Doctors** - Doctor profiles and specializations
4. **Appointments** - Scheduling and appointment management
5. **Prescriptions** - Medication prescriptions
6. **Drugs** - Pharmacy inventory
7. **LabTests** - Laboratory test requests and results
8. **Wards** - Bed and ward management
9. **Invoices** - Billing and payment tracking

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📈 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] AI-powered diagnosis assistance
- [ ] Telemedicine integration
- [ ] DICOM image viewer
- [ ] Integration with insurance APIs
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] IoT device integration
- [ ] Blockchain for medical records
- [ ] Voice commands and accessibility

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact: support@hospital-erp.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- MongoDB and Redis teams
- All open-source contributors

---

**Built with ❤️ for better healthcare management**
