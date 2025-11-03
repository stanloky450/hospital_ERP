const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
    },
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
    testName: {
      type: String,
      required: true,
    },
    testCategory: {
      type: String,
      enum: ['Hematology', 'Biochemistry', 'Microbiology', 'Pathology', 'Radiology', 'Other'],
    },
    sampleType: String,
    sampleCollectedAt: Date,
    sampleCollectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    results: [
      {
        parameter: String,
        value: String,
        unit: String,
        normalRange: String,
        flag: {
          type: String,
          enum: ['Normal', 'Low', 'High', 'Critical'],
        },
      },
    ],
    status: {
      type: String,
      enum: ['Requested', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    priority: {
      type: String,
      enum: ['Routine', 'Urgent', 'STAT'],
      default: 'Routine',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    resultDate: Date,
    notes: String,
    reportUrl: String,
  },
  {
    timestamps: true,
  }
);

labTestSchema.index({ testId: 1 });
labTestSchema.index({ patient: 1 });
labTestSchema.index({ status: 1 });

const LabTest = mongoose.model('LabTest', labTestSchema);

module.exports = LabTest;
