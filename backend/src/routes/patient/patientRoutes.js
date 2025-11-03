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
  .post(restrictTo('Admin', 'Doctor', 'Receptionist'), createPatient);

router.route('/:id')
  .get(getPatient)
  .put(restrictTo('Admin', 'Doctor', 'Receptionist'), updatePatient)
  .delete(restrictTo('Super Admin', 'Admin'), deletePatient);

module.exports = router;
