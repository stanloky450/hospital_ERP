require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../config/logger');

// Import models
const Staff = require('../models/staff/Staff');
const Patient = require('../models/patient/Patient');
const Doctor = require('../models/doctor/Doctor');
const Drug = require('../models/pharmacy/Drug');
const Ward = require('../models/ward/Ward');

// Import seed data
const staffData = require('./staffSeed');
const patientData = require('./patientSeed');
const doctorData = require('./doctorSeed');
const drugData = require('./drugSeed');
const wardData = require('./wardSeed');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('MongoDB Connected for seeding');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Delete all existing data
const deleteData = async () => {
  try {
    await Staff.deleteMany();
    await Patient.deleteMany();
    await Doctor.deleteMany();
    await Drug.deleteMany();
    await Ward.deleteMany();
    logger.info('✓ All existing data deleted');
  } catch (error) {
    logger.error(`Error deleting data: ${error.message}`);
    throw error;
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...\n');

    // 1. Seed Staff (all roles)
    logger.info('1. Seeding staff...');
    const staff = await staffData();
    const staffDocs = await Staff.create(staff);
    logger.info(`   ✓ Created ${staffDocs.length} staff members`);
    logger.info(`   - Super Admin: superadmin@hospital.com`);
    logger.info(`   - Admin: admin@hospital.com`);
    logger.info(`   - Doctors: 3 (Cardiology, General, Pediatrics)`);
    logger.info(`   - Nurses: 2`);
    logger.info(`   - Pharmacist: 1`);
    logger.info(`   - Lab Technician: 1`);
    logger.info(`   - Radiologist: 1`);
    logger.info(`   - Receptionist: 1`);
    logger.info(`   - Accountant: 1`);
    logger.info(`   - HR Manager: 1`);
    logger.info(`   - IT Support: 1`);
    logger.info(`   - Housekeeper: 1`);
    logger.info(`   - Security: 1`);
    logger.info(`   - Dietician: 1`);
    logger.info(`   📧 Default password for all: password123\n`);

    // 2. Seed Doctors (extends staff)
    logger.info('2. Seeding doctors...');
    const doctorStaffIds = staffDocs
      .filter((s) => s.role === 'Doctor')
      .map((s) => s._id);
    const doctors = doctorData(doctorStaffIds);
    const doctorDocs = await Doctor.create(doctors);
    logger.info(`   ✓ Created ${doctorDocs.length} doctor profiles with schedules\n`);

    // 3. Seed Patients
    logger.info('3. Seeding patients...');
    const receptionistId = staffDocs.find((s) => s.role === 'Receptionist')?._id;
    const patients = patientData(receptionistId);
    const patientDocs = await Patient.create(patients);
    logger.info(`   ✓ Created ${patientDocs.length} patients`);
    logger.info(`   - With medical history, allergies, and insurance\n`);

    // 4. Seed Drugs
    logger.info('4. Seeding pharmacy drugs...');
    const pharmacistId = staffDocs.find((s) => s.role === 'Pharmacist')?._id;
    const drugs = drugData(pharmacistId);
    const drugDocs = await Drug.create(drugs);
    logger.info(`   ✓ Created ${drugDocs.length} drugs in inventory`);
    logger.info(`   - With batch numbers, expiry dates, and pricing\n`);

    // 5. Seed Wards
    logger.info('5. Seeding wards...');
    const headNurseId = staffDocs.find((s) => s.designation === 'Head Nurse')?._id;
    const wards = wardData(headNurseId);
    const wardDocs = await Ward.create(wards);
    logger.info(`   ✓ Created ${wardDocs.length} wards`);
    wardDocs.forEach((ward) => {
      logger.info(`   - ${ward.name}: ${ward.totalBeds} beds available`);
    });

    logger.info('\n✅ Database seeding completed successfully!\n');
    logger.info('═'.repeat(60));
    logger.info('📊 SEEDING SUMMARY');
    logger.info('═'.repeat(60));
    logger.info(`Staff Members:    ${staffDocs.length}`);
    logger.info(`Doctor Profiles:  ${doctorDocs.length}`);
    logger.info(`Patients:         ${patientDocs.length}`);
    logger.info(`Drugs:            ${drugDocs.length}`);
    logger.info(`Wards:            ${wardDocs.length}`);
    logger.info(`Total Beds:       ${wardDocs.reduce((sum, w) => sum + w.totalBeds, 0)}`);
    logger.info('═'.repeat(60));
    logger.info('\n🔐 LOGIN CREDENTIALS');
    logger.info('═'.repeat(60));
    logger.info('Email:    superadmin@hospital.com');
    logger.info('Password: password123');
    logger.info('Role:     Super Admin\n');
    logger.info('Email:    admin@hospital.com');
    logger.info('Password: password123');
    logger.info('Role:     Admin\n');
    logger.info('Email:    sarah.johnson@hospital.com');
    logger.info('Password: password123');
    logger.info('Role:     Doctor (Cardiologist)\n');
    logger.info('Email:    david.williams@hospital.com');
    logger.info('Password: password123');
    logger.info('Role:     Doctor (General Medicine)\n');
    logger.info('Email:    emily.brown@hospital.com');
    logger.info('Password: password123');
    logger.info('Role:     Doctor (Pediatrician)\n');
    logger.info('...and more (see staff seed for all credentials)');
    logger.info('═'.repeat(60));
    logger.info('\n💡 TIP: You can now start the server and login!');
    logger.info('   Backend:  cd backend && npm run dev');
    logger.info('   Frontend: cd frontend && npm run dev\n');
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    throw error;
  }
};

// Main execution
const runSeeder = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check for command line arguments
    const args = process.argv.slice(2);

    if (args.includes('--delete') || args.includes('-d')) {
      // Only delete data
      logger.info('Deleting all data...\n');
      await deleteData();
      logger.info('\n✅ All data deleted successfully!\n');
    } else if (args.includes('--help') || args.includes('-h')) {
      // Show help
      console.log('\n📖 Hospital ERP Database Seeder\n');
      console.log('Usage: npm run seed [options]\n');
      console.log('Options:');
      console.log('  (no args)     Delete all data and seed fresh data');
      console.log('  -d, --delete  Delete all data only');
      console.log('  -h, --help    Show this help message\n');
    } else {
      // Default: delete and seed
      await deleteData();
      await seedDatabase();
    }

    // Disconnect from database
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
