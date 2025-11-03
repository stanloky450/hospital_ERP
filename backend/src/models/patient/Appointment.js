const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Appointment ID
    appointmentId: {
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

    // Appointment Details
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 15,
    }, // in minutes

    // Type and Purpose
    type: {
      type: String,
      enum: ['New Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'],
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    symptoms: [String],

    // Status
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Checked-In', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
      default: 'Scheduled',
    },

    // Booking Information
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    bookingSource: {
      type: String,
      enum: ['Walk-in', 'Phone', 'Online Portal', 'Mobile App', 'Reception'],
      default: 'Reception',
    },

    // Check-in Information
    checkInTime: Date,
    checkInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },

    // Consultation
    consultationStartTime: Date,
    consultationEndTime: Date,

    // Vitals (recorded at check-in)
    vitals: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      temperature: Number,
      pulse: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      height: Number,
      weight: Number,
      bmi: Number,
    },

    // Queue Information
    queueNumber: Number,
    estimatedWaitTime: Number, // in minutes

    // Payment
    consultationFee: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded'],
      default: 'Pending',
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Card', 'Insurance', 'Online'],
    },

    // Cancellation
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    cancelledAt: Date,

    // Rescheduling
    isRescheduled: {
      type: Boolean,
      default: false,
    },
    previousAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    rescheduledFrom: Date,

    // Notes
    notes: String,
    internalNotes: String,

    // Reminders
    remindersSent: [
      {
        type: {
          type: String,
          enum: ['SMS', 'Email', 'WhatsApp'],
        },
        sentAt: Date,
        status: String,
      },
    ],

    // Follow-up
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    followUpNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
appointmentSchema.index({ appointmentId: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Calculate BMI before saving
appointmentSchema.pre('save', function (next) {
  if (this.vitals && this.vitals.height && this.vitals.weight) {
    const heightInMeters = this.vitals.height / 100;
    this.vitals.bmi = (this.vitals.weight / (heightInMeters * heightInMeters)).toFixed(2);
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
