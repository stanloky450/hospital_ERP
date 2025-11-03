const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    // Reference to Staff
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
      unique: true,
    },

    // Doctor Specific Information
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'Gynecology',
        'Oncology',
        'Ophthalmology',
        'ENT',
        'Psychiatry',
        'General Medicine',
        'Surgery',
        'Anesthesiology',
        'Radiology',
        'Pathology',
        'Emergency Medicine',
        'Other',
      ],
    },
    subSpecialization: [String],
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    experience: {
      type: Number,
      required: true,
    }, // in years

    // Practice Information
    registrationNumber: String,
    registrationCouncil: String,
    registrationYear: Number,

    // Consultation Details
    consultationFee: {
      type: Number,
      required: true,
    },
    followUpFee: Number,
    averageConsultationTime: {
      type: Number,
      default: 15,
    }, // in minutes

    // Availability
    availableForEmergency: {
      type: Boolean,
      default: false,
    },
    acceptingNewPatients: {
      type: Boolean,
      default: true,
    },

    // Schedule
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        shifts: [
          {
            startTime: String, // Format: "HH:mm"
            endTime: String,
            slotDuration: {
              type: Number,
              default: 15,
            }, // in minutes
            maxPatients: Number,
          },
        ],
      },
    ],

    // Leaves
    leaves: [
      {
        startDate: Date,
        endDate: Date,
        reason: String,
        status: {
          type: String,
          enum: ['Pending', 'Approved', 'Rejected'],
          default: 'Pending',
        },
      },
    ],

    // Ratings and Reviews
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Statistics
    stats: {
      totalConsultations: {
        type: Number,
        default: 0,
      },
      totalSurgeries: {
        type: Number,
        default: 0,
      },
      patientsServed: {
        type: Number,
        default: 0,
      },
    },

    // Awards and Recognition
    awards: [
      {
        title: String,
        year: Number,
        organization: String,
      },
    ],

    // Research and Publications
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
        doi: String,
      },
    ],

    // Languages Spoken
    languages: [String],

    // Signature (for prescriptions)
    signature: String,

    // Status
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
doctorSchema.index({ staff: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isAvailable: 1 });

// Virtual for appointments
doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctor',
});

// Virtual for consultations
doctorSchema.virtual('consultations', {
  ref: 'Consultation',
  localField: '_id',
  foreignField: 'doctor',
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
