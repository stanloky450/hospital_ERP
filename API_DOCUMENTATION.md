# Hospital ERP - API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.your-hospital.com/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

---

## 📌 Authentication Endpoints

### 1. Login
**POST** `/auth/login`

Login to the system and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@hospital.com",
    "role": "Super Admin",
    "department": "Administration",
    "permissions": ["all"],
    "profilePicture": null
  }
}
```

---

### 2. Register Staff (Admin Only)
**POST** `/auth/register`

Register a new staff member.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@hospital.com",
  "password": "SecurePassword123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "department": "Medical",
  "designation": "Senior Doctor",
  "role": "Doctor",
  "salary": 75000,
  "employeeId": "EMP001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Staff registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@hospital.com",
    "role": "Doctor"
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@hospital.com",
    "role": "Doctor",
    "department": "Medical",
    "profilePicture": null,
    "isActive": true
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

Logout the current user and invalidate the session.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Update Password
**PUT** `/auth/updatepassword`

Update the current user's password.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "user": { ... }
}
```

---

### 6. Update Profile
**PUT** `/auth/updateprofile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "phone": "+1987654321",
  "alternatePhone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 👥 Patient Endpoints

### 1. Get All Patients
**GET** `/patients`

Retrieve a paginated list of patients.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search by name, email, phone, or patient ID
- `status` (string) - Filter by status: Active, Inactive, Deceased

**Example:**
```
GET /patients?page=1&limit=20&search=john&status=Active
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "totalPages": 8,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "patientId": "PAT000001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "phone": "+1234567890",
      "dateOfBirth": "1985-03-15",
      "gender": "Male",
      "bloodGroup": "O+",
      "status": "Active",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Patient
**GET** `/patients/:id`

Get detailed information about a specific patient.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patientId": "PAT000001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "+1234567890",
    "alternatePhone": null,
    "dateOfBirth": "1985-03-15",
    "gender": "Male",
    "bloodGroup": "O+",
    "maritalStatus": "Married",
    "nationality": "American",
    "occupation": "Engineer",
    "address": {
      "street": "456 Oak Ave",
      "city": "Boston",
      "state": "MA",
      "country": "USA",
      "zipCode": "02101"
    },
    "emergencyContact": {
      "name": "Jane Smith",
      "relationship": "Spouse",
      "phone": "+1987654321"
    },
    "allergies": [
      {
        "allergen": "Penicillin",
        "severity": "Severe",
        "reaction": "Anaphylaxis"
      }
    ],
    "chronicConditions": [],
    "currentMedications": [],
    "insurance": {
      "provider": "HealthCare Inc",
      "policyNumber": "POL123456",
      "validUntil": "2025-12-31"
    },
    "status": "Active",
    "age": 39,
    "fullName": "John Smith",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

---

### 3. Create Patient
**POST** `/patients`

Register a new patient in the system.

**Headers:**
```
Authorization: Bearer {token}
```

**Allowed Roles:** Admin, Doctor, Receptionist

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@email.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-07-20",
  "gender": "Female",
  "bloodGroup": "A+",
  "maritalStatus": "Single",
  "address": {
    "street": "789 Pine St",
    "city": "Chicago",
    "state": "IL",
    "country": "USA",
    "zipCode": "60601"
  },
  "emergencyContact": {
    "name": "John Doe",
    "relationship": "Brother",
    "phone": "+1987654321"
  },
  "allergies": [
    {
      "allergen": "Peanuts",
      "severity": "Moderate",
      "reaction": "Hives"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "patientId": "PAT000002",
    "firstName": "Jane",
    "lastName": "Doe",
    ...
  }
}
```

---

### 4. Update Patient
**PUT** `/patients/:id`

Update patient information.

**Headers:**
```
Authorization: Bearer {token}
```

**Allowed Roles:** Admin, Doctor, Receptionist

**Request Body:**
```json
{
  "phone": "+1111111111",
  "email": "newemail@example.com",
  "address": {
    "street": "New Address",
    "city": "New City"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Patient
**DELETE** `/patients/:id`

Delete a patient from the system (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Allowed Roles:** Super Admin, Admin

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

---

## 📊 Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 🔐 Role-Based Access Control

### Roles
1. **Super Admin** - Full system access
2. **Admin** - Administrative tasks
3. **Doctor** - Medical operations
4. **Nurse** - Patient care
5. **Pharmacist** - Pharmacy operations
6. **Lab Technician** - Laboratory operations
7. **Receptionist** - Patient registration, appointments
8. **Accountant** - Billing and finance
9. **HR Manager** - Staff management

### Permission Matrix

| Endpoint | Super Admin | Admin | Doctor | Nurse | Receptionist |
|----------|-------------|-------|--------|-------|--------------|
| POST /auth/register | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /patients | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /patients | ✅ | ✅ | ✅ | ❌ | ✅ |
| PUT /patients/:id | ✅ | ✅ | ✅ | ❌ | ✅ |
| DELETE /patients/:id | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 📝 Additional Endpoints

### Appointment Endpoints
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Pharmacy Endpoints
- `GET /pharmacy/drugs` - Get all drugs
- `POST /pharmacy/drugs` - Add new drug
- `GET /pharmacy/prescriptions` - Get prescriptions
- `POST /pharmacy/prescriptions` - Create prescription

### Laboratory Endpoints
- `GET /laboratory/tests` - Get all lab tests
- `POST /laboratory/tests` - Create lab test request
- `PUT /laboratory/tests/:id/results` - Update test results

### Billing Endpoints
- `GET /billing/invoices` - Get all invoices
- `POST /billing/invoices` - Create invoice
- `POST /billing/payments` - Process payment

---

## 💡 Best Practices

1. **Always include the Authorization header** for protected routes
2. **Use pagination** for list endpoints to improve performance
3. **Implement retry logic** for failed requests
4. **Cache frequently accessed data** on the client side
5. **Handle errors gracefully** and show user-friendly messages
6. **Validate input** on both client and server side

---

## 📞 Support

For API support, contact: api-support@hospital-erp.com
