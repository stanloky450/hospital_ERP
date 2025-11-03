const Staff = require('../../models/staff/Staff');
const { sendTokenResponse } = require('../../utils/tokenUtils');
const logger = require('../../config/logger');
const cacheService = require('../../services/redis/cacheService');

// @desc    Register new staff
// @route   POST /api/v1/auth/register
// @access  Private (Admin only)
exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      department,
      designation,
      role,
      salary,
      employeeId,
    } = req.body;

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Staff with this email already exists',
      });
    }

    // Create staff
    const staff = await Staff.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      department,
      designation,
      role,
      salary,
      employeeId,
    });

    logger.info(`New staff registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Staff registered successfully',
      data: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login staff
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for staff
    const staff = await Staff.findOne({ email }).select('+password');

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if staff is active
    if (!staff.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.',
      });
    }

    // Check if password matches
    const isMatch = await staff.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    staff.lastLogin = Date.now();
    await staff.save({ validateBeforeSave: false });

    logger.info(`Staff logged in: ${email}`);

    // Send token response
    sendTokenResponse(staff, 200, res);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

// @desc    Get current logged in staff
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // Check cache first
    const cacheKey = `staff:${req.user.id}`;
    const cachedStaff = await cacheService.get(cacheKey);

    if (cachedStaff) {
      return res.status(200).json({
        success: true,
        data: cachedStaff,
      });
    }

    const staff = await Staff.findById(req.user.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found',
      });
    }

    // Cache the result
    await cacheService.set(cacheKey, staff, 1800); // 30 minutes

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};

// @desc    Logout staff
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // Clear cache
    await cacheService.del(`staff:${req.user.id}`);

    logger.info(`Staff logged out: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.user.id).select('+password');

    // Check current password
    if (!(await staff.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    staff.password = req.body.newPassword;
    await staff.save();

    logger.info(`Password updated: ${staff.email}`);

    sendTokenResponse(staff, 200, res);
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
    });
  }
};

// @desc    Update profile
// @route   PUT /api/v1/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      phone: req.body.phone,
      alternatePhone: req.body.alternatePhone,
      address: req.body.address,
      emergencyContact: req.body.emergencyContact,
    };

    const staff = await Staff.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Clear cache
    await cacheService.del(`staff:${req.user.id}`);

    logger.info(`Profile updated: ${staff.email}`);

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};
