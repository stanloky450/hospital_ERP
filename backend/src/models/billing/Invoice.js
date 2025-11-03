const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    // Invoice Details
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: Date,

    // Items/Services
    items: [
      {
        type: {
          type: String,
          enum: ['Consultation', 'Medication', 'Lab Test', 'Radiology', 'Surgery', 'Room Charges', 'Other'],
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        reference: mongoose.Schema.Types.ObjectId, // Reference to appointment, prescription, etc.
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
        tax: {
          type: Number,
          default: 0,
        },
        total: Number,
      },
    ],

    // Totals
    subtotal: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Payment
    paidAmount: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid', 'Refunded'],
      default: 'Unpaid',
    },

    // Insurance
    insuranceClaim: {
      claimed: {
        type: Boolean,
        default: false,
      },
      claimAmount: Number,
      approvedAmount: Number,
      claimStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Partially Approved'],
      },
    },

    // Staff
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },

    // Status
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Paid', 'Cancelled', 'Overdue'],
      default: 'Draft',
    },

    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
invoiceSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    item.total = item.quantity * item.unitPrice - item.discount + item.tax;
    return sum + item.total;
  }, 0);

  this.totalDiscount = this.items.reduce((sum, item) => sum + item.discount, 0);
  this.totalTax = this.items.reduce((sum, item) => sum + item.tax, 0);
  this.totalAmount = this.subtotal;
  this.balanceAmount = this.totalAmount - this.paidAmount;

  next();
});

invoiceSchema.index({ invoiceId: 1 });
invoiceSchema.index({ patient: 1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
