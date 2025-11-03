const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema(
  {
    // Drug Information
    drugId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    brandName: String,

    // Category and Classification
    category: {
      type: String,
      required: true,
      enum: [
        'Antibiotic',
        'Analgesic',
        'Antihistamine',
        'Antihypertensive',
        'Antidiabetic',
        'Antacid',
        'Vitamin',
        'Antipyretic',
        'Antiseptic',
        'Other',
      ],
    },
    subCategory: String,
    therapeuticClass: String,

    // Formulation
    formulation: {
      type: String,
      required: true,
      enum: [
        'Tablet',
        'Capsule',
        'Syrup',
        'Injection',
        'Ointment',
        'Cream',
        'Drops',
        'Inhaler',
        'Spray',
        'Powder',
        'Other',
      ],
    },
    strength: {
      value: Number,
      unit: String, // mg, ml, etc.
    },

    // Manufacturer
    manufacturer: {
      name: {
        type: String,
        required: true,
      },
      country: String,
    },

    // Storage and Handling
    storageConditions: String,
    requiresRefrigeration: {
      type: Boolean,
      default: false,
    },

    // Prescription Requirements
    requiresPrescription: {
      type: Boolean,
      default: true,
    },
    isControlled: {
      type: Boolean,
      default: false,
    },
    schedule: String, // For controlled substances

    // Stock Information
    stock: {
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      unit: {
        type: String,
        default: 'units',
      },
      reorderLevel: {
        type: Number,
        default: 10,
      },
      maxStockLevel: Number,
    },

    // Pricing
    pricing: {
      costPrice: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      mrp: Number,
      discount: {
        type: Number,
        default: 0,
      },
    },

    // Batches
    batches: [
      {
        batchNumber: {
          type: String,
          required: true,
        },
        quantity: Number,
        manufactureDate: Date,
        expiryDate: {
          type: Date,
          required: true,
        },
        supplier: String,
        costPrice: Number,
        receivedDate: Date,
      },
    ],

    // Additional Information
    description: String,
    sideEffects: [String],
    contraindications: [String],
    interactions: [String],
    dosageInstructions: String,

    // Barcode/SKU
    barcode: String,
    sku: String,

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Metadata
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
drugSchema.index({ drugId: 1 });
drugSchema.index({ name: 'text', genericName: 'text' });
drugSchema.index({ category: 1 });
drugSchema.index({ barcode: 1 });
drugSchema.index({ 'stock.quantity': 1 });

// Virtual for stock status
drugSchema.virtual('stockStatus').get(function () {
  if (this.stock.quantity === 0) return 'Out of Stock';
  if (this.stock.quantity <= this.stock.reorderLevel) return 'Low Stock';
  return 'In Stock';
});

// Check for expired batches
drugSchema.methods.getExpiredBatches = function () {
  const today = new Date();
  return this.batches.filter((batch) => batch.expiryDate < today);
};

// Check for near-expiry batches (within 3 months)
drugSchema.methods.getNearExpiryBatches = function () {
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  return this.batches.filter(
    (batch) => batch.expiryDate > today && batch.expiryDate <= threeMonthsLater
  );
};

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
