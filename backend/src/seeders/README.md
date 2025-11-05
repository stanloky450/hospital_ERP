# Hospital ERP Database Seeder

This directory contains seed data to populate your Hospital ERP database with initial data for testing and development.

## 📊 What Gets Seeded

### 1. Staff (17 members across all roles)
- **Super Admin** (1) - Full system access
- **Admin** (1) - Administrative access
- **Doctors** (3)
  - Cardiologist
  - General Physician
  - Pediatrician
- **Nurses** (2)
  - Head Nurse
  - ICU Nurse
- **Pharmacist** (1)
- **Lab Technician** (1)
- **Radiologist** (1)
- **Receptionist** (1)
- **Accountant** (1)
- **HR Manager** (1)
- **IT Support** (1)
- **Housekeeper** (1)
- **Security** (1)
- **Dietician** (1)

**Default Password for All Staff:** `password123`

### 2. Doctor Profiles (3 profiles with schedules)
- Complete doctor information extending staff data
- Weekly schedules with time slots
- Specializations and qualifications
- Consultation fees
- Ratings and statistics

### 3. Patients (8 patients)
- Diverse patient profiles with:
  - Personal information
  - Medical history
  - Allergies
  - Chronic conditions
  - Insurance information
  - Emergency contacts

### 4. Drugs (10 common medications)
- Drug inventory with:
  - Batch numbers
  - Expiry dates
  - Stock quantities
  - Pricing information
  - Storage requirements
  - Side effects and contraindications

### 5. Wards (8 wards, 101 total beds)
- **General Ward A** - 20 beds (Floor 1)
- **General Ward B** - 20 beds (Floor 1)
- **ICU Ward** - 10 beds (Floor 2)
- **CCU Ward** - 8 beds (Floor 2)
- **Maternity Ward** - 15 beds (Floor 3)
- **Pediatric Ward** - 12 beds (Floor 3)
- **Emergency Ward** - 10 beds (Floor 0)
- **Isolation Ward** - 6 beds (Floor 4)

## 🚀 How to Use

### Prerequisites
Make sure MongoDB is running on your system.

### Run the Seeder

**Option 1: Seed the database (delete all data and add fresh data)**
```bash
cd backend
npm run seed
```

**Option 2: Delete all data only**
```bash
npm run seed:delete
```

**Option 3: Show help**
```bash
node src/seeders/index.js --help
```

## 🔐 Login Credentials

After seeding, you can login with any of these accounts:

### Super Admin
```
Email:    superadmin@hospital.com
Password: password123
Role:     Super Admin
```

### Admin
```
Email:    admin@hospital.com
Password: password123
Role:     Admin
```

### Doctors
```
Email:    sarah.johnson@hospital.com
Password: password123
Role:     Doctor (Cardiologist)

Email:    david.williams@hospital.com
Password: password123
Role:     Doctor (General Medicine)

Email:    emily.brown@hospital.com
Password: password123
Role:     Doctor (Pediatrician)
```

### Nurses
```
Email:    maria.garcia@hospital.com
Password: password123
Role:     Nurse (Head Nurse)

Email:    jennifer.martinez@hospital.com
Password: password123
Role:     Nurse (ICU Nurse)
```

### Other Staff
```
Email:    robert.taylor@hospital.com
Password: password123
Role:     Pharmacist

Email:    michael.anderson@hospital.com
Password: password123
Role:     Lab Technician

Email:    james.wilson@hospital.com
Password: password123
Role:     Radiologist

Email:    amanda.moore@hospital.com
Password: password123
Role:     Receptionist

Email:    richard.thomas@hospital.com
Password: password123
Role:     Accountant

Email:    patricia.jackson@hospital.com
Password: password123
Role:     HR Manager

Email:    christopher.white@hospital.com
Password: password123
Role:     IT Support

Email:    jessica.harris@hospital.com
Password: password123
Role:     Housekeeper

Email:    kevin.martin@hospital.com
Password: password123
Role:     Security

Email:    laura.thompson@hospital.com
Password: password123
Role:     Dietician
```

## 📁 Seed Files

- **staffSeed.js** - All staff members (17 users)
- **doctorSeed.js** - Doctor profiles with schedules
- **patientSeed.js** - Patient records
- **drugSeed.js** - Pharmacy inventory
- **wardSeed.js** - Hospital wards and beds
- **index.js** - Main seeder script

## 🔄 Development Workflow

### Initial Setup
```bash
# 1. Start MongoDB
sudo systemctl start mongod

# 2. Create .env file
cp .env.example .env

# 3. Seed the database
npm run seed

# 4. Start the server
npm run dev
```

### Reset Database
```bash
# Delete all data and reseed
npm run seed
```

### Clear Database Only
```bash
# Just delete all data
npm run seed:delete
```

## ⚠️ Important Notes

1. **Production Warning:** Never run the seeder on a production database! It will delete all existing data.

2. **Password Security:** The default password `password123` is only for development. Change it immediately in production.

3. **Customization:** You can modify the seed files to add your own test data.

4. **Order Matters:** The seeder runs in a specific order to maintain referential integrity:
   - Staff → Doctors → Patients → Drugs → Wards

5. **IDs:** The seeder automatically handles relationships between models (e.g., doctor references to staff).

## 🎯 What You Can Test

After seeding, you can test:

### Authentication
- Login as different roles
- Role-based access control
- Permission checks

### Patient Management
- View patients list
- Search patients
- View patient details with medical history

### Doctor Schedules
- View doctor availability
- Check consultation fees
- See doctor specializations

### Pharmacy
- Browse drug inventory
- Check stock levels
- View drug information

### Ward Management
- View ward occupancy
- Check bed availability
- See ward distribution

## 🔧 Troubleshooting

### Seeder fails to connect
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### Permission errors
```bash
# Make sure you're in the backend directory
cd backend

# Run with correct Node version
node --version  # Should be >= 18.0.0
```

### Duplicate key errors
```bash
# Clean the database first
npm run seed:delete

# Then seed again
npm run seed
```

## 📝 Adding Custom Seed Data

To add your own seed data:

1. **Edit existing seed files** in `backend/src/seeders/`
2. **Follow the existing pattern** for data structure
3. **Maintain relationships** between models
4. **Run the seeder** to test your changes

Example:
```javascript
// In patientSeed.js, add a new patient
{
  patientId: 'PAT000009',
  firstName: 'Your',
  lastName: 'Patient',
  // ... rest of the fields
}
```

## 🎓 Learning Resources

Use the seed data to:
- Understand the data model
- Test API endpoints
- Build frontend components
- Practice queries
- Test relationships between models

## 📞 Support

If you encounter issues with the seeder:
1. Check MongoDB is running
2. Verify .env configuration
3. Check console output for specific errors
4. Ensure all dependencies are installed

---

**Ready to seed your database!** 🌱

Run `npm run seed` to get started.
