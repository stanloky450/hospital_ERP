const express = require('express');
const {
  getWards,
  getWard,
  createWard,
  updateWard,
  deleteWard,
  assignBed,
  dischargeBed,
} = require('../../controllers/ward/wardController');

const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// All staff can view wards
router.get('/', getWards);
router.get('/:id', getWard);

// Admin can create and delete wards
router.post('/', restrictTo('Super Admin', 'Admin'), createWard);
router.delete('/:id', restrictTo('Super Admin', 'Admin'), deleteWard);

// Admin and Nurse can update wards
router.put(
  '/:id',
  restrictTo('Super Admin', 'Admin', 'Nurse'),
  updateWard
);

// Nurse, Receptionist, and Cashier can assign beds
router.put(
  '/:id/beds/:bedNumber/assign',
  restrictTo('Super Admin', 'Admin', 'Nurse', 'Receptionist', 'Cashier'),
  assignBed
);

// Nurse and Doctor can discharge patients
router.put(
  '/:id/beds/:bedNumber/discharge',
  restrictTo('Super Admin', 'Admin', 'Nurse', 'Doctor'),
  dischargeBed
);

module.exports = router;
