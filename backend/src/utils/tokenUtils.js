const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate Refresh Token
exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

// Send token response
exports.sendTokenResponse = (staff, statusCode, res) => {
  // Create token
  const token = this.generateToken(staff._id);
  const refreshToken = this.generateRefreshToken(staff._id);

  const options = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Remove password from output
  staff.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      permissions: staff.permissions,
      profilePicture: staff.profilePicture,
    },
  });
};
