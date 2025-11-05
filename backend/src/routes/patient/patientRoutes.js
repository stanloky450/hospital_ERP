const express = require('express');
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../../controllers/patient/patientController');
const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getPatients)
  .post(restrictTo('Super Admin', 'Admin', 'Doctor', 'Receptionist', 'Nurse', 'Cashier'), createPatient);

router.route('/:id')
  .get(getPatient)
  .put(restrictTo('Super Admin', 'Admin', 'Doctor', 'Receptionist', 'Nurse', 'Cashier'), updatePatient)
  .delete(restrictTo('Super Admin', 'Admin'), deletePatient);

module.exports = router;
