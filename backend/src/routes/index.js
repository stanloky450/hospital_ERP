const express = require('express');
const authRoutes = require('./auth/authRoutes');
const patientRoutes = require('./patient/patientRoutes');
const appointmentRoutes = require('./appointment/appointmentRoutes');
const wardRoutes = require('./ward/wardRoutes');
const pharmacyRoutes = require('./pharmacy/pharmacyRoutes');
// Import other routes as they are created
// const doctorRoutes = require('./doctor/doctorRoutes');
// const laboratoryRoutes = require('./laboratory/laboratoryRoutes');
// const billingRoutes = require('./billing/billingRoutes');
// const staffRoutes = require('./staff/staffRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hospital ERP API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/wards', wardRoutes);
router.use('/pharmacy', pharmacyRoutes);
// Mount other routes as they are created
// router.use('/doctors', doctorRoutes);
// router.use('/laboratory', laboratoryRoutes);
// router.use('/billing', billingRoutes);
// router.use('/staff', staffRoutes);

module.exports = router;
