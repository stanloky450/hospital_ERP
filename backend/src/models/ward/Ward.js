const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema(
  {
    wardId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['General', 'ICU', 'NICU', 'CCU', 'Maternity', 'Pediatric', 'Isolation', 'Emergency'],
      required: true,
    },
    floor: Number,
    totalBeds: {
      type: Number,
      required: true,
    },
    availableBeds: {
      type: Number,
      required: true,
    },
    beds: [
      {
        bedNumber: String,
        isOccupied: {
          type: Boolean,
          default: false,
        },
        patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Patient',
        },
        admissionDate: Date,
      },
    ],
    nurseInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

wardSchema.index({ wardId: 1 });
wardSchema.index({ type: 1 });

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
