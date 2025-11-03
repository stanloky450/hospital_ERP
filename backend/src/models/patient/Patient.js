const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    // Patient Identification
    patientId: {
      type: String,
      required: true,
      unique: true,
    },

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
    nationality: String,
    occupation: String,

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    // Medical Information
    allergies: [
      {
        allergen: String,
        severity: {
          type: String,
          enum: ['Mild', 'Moderate', 'Severe'],
        },
        reaction: String,
      },
    ],
    chronicConditions: [
      {
        condition: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ['Active', 'Controlled', 'Resolved'],
          default: 'Active',
        },
      },
    ],
    currentMedications: [
      {
        medication: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        prescribedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Staff',
        },
      },
    ],
    pastSurgeries: [
      {
        surgery: String,
        date: Date,
        hospital: String,
        surgeon: String,
      },
    ],

    // Insurance Information
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      validFrom: Date,
      validUntil: Date,
      coverageType: String,
      coverageAmount: Number,
    },

    // Family Medical History
    familyHistory: [
      {
        relation: String,
        condition: String,
        ageAtDiagnosis: Number,
      },
    ],

    // Registration Information
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },

    // Status
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Deceased'],
      default: 'Active',
    },

    // Profile Picture
    profilePicture: String,

    // Patient Portal Access
    portalAccess: {
      enabled: {
        type: Boolean,
        default: false,
      },
      username: String,
      password: {
        type: String,
        select: false,
      },
      lastLogin: Date,
    },

    // Notes
    notes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Staff',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Documents
    documents: [
      {
        type: {
          type: String,
          enum: ['ID Proof', 'Insurance Card', 'Medical Report', 'Other'],
        },
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
patientSchema.index({ patientId: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for appointments
patientSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patient',
});

// Virtual for medical records
patientSchema.virtual('medicalRecords', {
  ref: 'MedicalRecord',
  localField: '_id',
  foreignField: 'patient',
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
