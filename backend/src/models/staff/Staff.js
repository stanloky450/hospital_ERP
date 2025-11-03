const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    alternatePhone: String,
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Employment Information
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Administration',
        'Medical',
        'Nursing',
        'Pharmacy',
        'Laboratory',
        'Radiology',
        'Emergency',
        'Billing',
        'HR',
        'IT',
        'Housekeeping',
        'Security',
        'Dietary',
      ],
    },
    designation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        'Super Admin',
        'Admin',
        'Doctor',
        'Nurse',
        'Pharmacist',
        'Lab Technician',
        'Radiologist',
        'Receptionist',
        'Accountant',
        'HR Manager',
        'IT Support',
        'Housekeeper',
        'Security',
        'Dietician',
      ],
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    employmentType: {
      type: String,
      enum: ['Permanent', 'Contract', 'Part-Time', 'Intern'],
      default: 'Permanent',
    },
    salary: {
      type: Number,
      required: true,
    },

    // Authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Documents
    documents: [
      {
        type: {
          type: String,
          enum: ['Resume', 'ID Proof', 'Certificate', 'Contract', 'Other'],
        },
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Profile Picture
    profilePicture: String,

    // Additional Info
    specialization: String,
    qualifications: [String],
    experience: Number, // in years
    languages: [String],

    // Permissions
    permissions: {
      type: [String],
      default: [],
    },

    // Status
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Suspended', 'Terminated'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
staffSchema.index({ email: 1 });
staffSchema.index({ employeeId: 1 });
staffSchema.index({ department: 1, role: 1 });

// Virtual for full name
staffSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
staffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update passwordChangedAt
staffSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare password method
staffSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
staffSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
