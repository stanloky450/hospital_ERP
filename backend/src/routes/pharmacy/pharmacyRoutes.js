const express = require('express');
const {
  getDrugs,
  getDrug,
  createDrug,
  updateDrug,
  deleteDrug,
  getLowStockDrugs,
  updateStock,
} = require('../../controllers/pharmacy/drugController');

const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// All staff can view drugs
router.get('/drugs', getDrugs);
router.get('/drugs/low-stock', getLowStockDrugs);
router.get('/drugs/:id', getDrug);

// Pharmacist and Admin can create and update drugs
router.post(
  '/drugs',
  restrictTo('Super Admin', 'Admin', 'Pharmacist'),
  createDrug
);

router.put(
  '/drugs/:id',
  restrictTo('Super Admin', 'Admin', 'Pharmacist'),
  updateDrug
);

router.put(
  '/drugs/:id/stock',
  restrictTo('Super Admin', 'Admin', 'Pharmacist'),
  updateStock
);

// Only Admin can delete drugs
router.delete(
  '/drugs/:id',
  restrictTo('Super Admin', 'Admin'),
  deleteDrug
);

module.exports = router;
