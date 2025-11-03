const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      required: true,
      unique: true,
    },

    // Patient and Doctor
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },

    // Prescription Date
    prescriptionDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Diagnosis
    diagnosis: {
      type: String,
      required: true,
    },
    icdCode: String, // International Classification of Diseases code

    // Medications
    medications: [
      {
        drug: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Drug',
          required: true,
        },
        drugName: String,
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        }, // e.g., "Twice daily", "Every 8 hours"
        duration: {
          value: Number,
          unit: {
            type: String,
            enum: ['days', 'weeks', 'months'],
          },
        },
        route: {
          type: String,
          enum: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Inhalation'],
        },
        instructions: String,
        quantity: {
          type: Number,
          required: true,
        },
        beforeFood: Boolean,
      },
    ],

    // Lab Tests (if prescribed)
    labTests: [
      {
        test: String,
        instructions: String,
      },
    ],

    // Instructions
    generalInstructions: String,
    dietaryAdvice: String,
    precautions: [String],

    // Follow-up
    followUpDate: Date,
    followUpInstructions: String,

    // Pharmacy Status
    pharmacyStatus: {
      type: String,
      enum: ['Pending', 'Partially Dispensed', 'Dispensed', 'Cancelled'],
      default: 'Pending',
    },
    dispensedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    dispensedAt: Date,

    // Digital Signature
    doctorSignature: String,

    // Validity
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },

    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
prescriptionSchema.index({ prescriptionId: 1 });
prescriptionSchema.index({ patient: 1, prescriptionDate: -1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ pharmacyStatus: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
