const express = require('express');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
} = require('../../controllers/appointment/appointmentController');

const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// All staff can view appointments
router.get('/', getAppointments);
router.get('/:id', getAppointment);

// Receptionist, Doctor, Nurse, Cashier can create appointments
router.post(
  '/',
  restrictTo('Super Admin', 'Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'),
  createAppointment
);

// Update and delete appointments
router.put(
  '/:id',
  restrictTo('Super Admin', 'Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'),
  updateAppointment
);

router.delete(
  '/:id',
  restrictTo('Super Admin', 'Admin', 'Receptionist'),
  deleteAppointment
);

// Cancel appointment
router.put(
  '/:id/cancel',
  restrictTo('Super Admin', 'Admin', 'Receptionist', 'Doctor', 'Nurse', 'Cashier'),
  cancelAppointment
);

module.exports = router;
