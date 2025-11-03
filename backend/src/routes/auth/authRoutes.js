const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
  updateProfile,
} = require('../../controllers/auth/authController');
const { protect, restrictTo } = require('../../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/updatepassword', updatePassword);
router.put('/updateprofile', updateProfile);

// Admin only routes
router.post('/register', restrictTo('Super Admin', 'Admin'), register);

module.exports = router;
