const Drug = require('../../models/pharmacy/Drug');

/**
 * @desc    Get all drugs
 * @route   GET /api/v1/pharmacy/drugs
 * @access  Private
 */
exports.getDrugs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, isAvailable, search } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (isAvailable) filter.isAvailable = isAvailable === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const drugs = await Drug.find(filter)
      .populate('addedBy', 'firstName lastName email')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Drug.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: drugs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: drugs,
    });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drugs',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single drug
 * @route   GET /api/v1/pharmacy/drugs/:id
 * @access  Private
 */
exports.getDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findById(req.params.id)
      .populate('addedBy', 'firstName lastName email department');

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: 'Drug not found',
      });
    }

    res.status(200).json({
      success: true,
      data: drug,
    });
  } catch (error) {
    console.error('Error fetching drug:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drug',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new drug
 * @route   POST /api/v1/pharmacy/drugs
 * @access  Private (Pharmacist/Admin only)
 */
exports.createDrug = async (req, res, next) => {
  try {
    // Add staff who added the drug
    req.body.addedBy = req.user._id;

    const drug = await Drug.create(req.body);

    const populatedDrug = await Drug.findById(drug._id)
      .populate('addedBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Drug created successfully',
      data: populatedDrug,
    });
  } catch (error) {
    console.error('Error creating drug:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating drug',
      error: error.message,
    });
  }
};

/**
 * @desc    Update drug
 * @route   PUT /api/v1/pharmacy/drugs/:id
 * @access  Private (Pharmacist/Admin only)
 */
exports.updateDrug = async (req, res, next) => {
  try {
    let drug = await Drug.findById(req.params.id);

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: 'Drug not found',
      });
    }

    drug = await Drug.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('addedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Drug updated successfully',
      data: drug,
    });
  } catch (error) {
    console.error('Error updating drug:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating drug',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete drug
 * @route   DELETE /api/v1/pharmacy/drugs/:id
 * @access  Private (Admin only)
 */
exports.deleteDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findById(req.params.id);

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: 'Drug not found',
      });
    }

    await drug.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Drug deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Error deleting drug:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting drug',
      error: error.message,
    });
  }
};

/**
 * @desc    Get low stock drugs
 * @route   GET /api/v1/pharmacy/drugs/low-stock
 * @access  Private (Pharmacist/Admin)
 */
exports.getLowStockDrugs = async (req, res, next) => {
  try {
    const drugs = await Drug.find({
      $expr: {
        $lte: ['$stock.quantity', '$stock.reorderLevel'],
      },
      isAvailable: true,
    })
      .populate('addedBy', 'firstName lastName email')
      .sort({ 'stock.quantity': 1 });

    res.status(200).json({
      success: true,
      count: drugs.length,
      data: drugs,
    });
  } catch (error) {
    console.error('Error fetching low stock drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock drugs',
      error: error.message,
    });
  }
};

/**
 * @desc    Update drug stock
 * @route   PUT /api/v1/pharmacy/drugs/:id/stock
 * @access  Private (Pharmacist only)
 */
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, action, batchNumber, expiryDate } = req.body;

    const drug = await Drug.findById(req.params.id);

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: 'Drug not found',
      });
    }

    if (action === 'add') {
      drug.stock.quantity += quantity;

      // Add new batch if provided
      if (batchNumber && expiryDate) {
        drug.batches.push({
          batchNumber,
          expiryDate,
          quantity,
          receivedDate: Date.now(),
        });
      }
    } else if (action === 'remove') {
      if (drug.stock.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock quantity',
        });
      }
      drug.stock.quantity -= quantity;
    }

    // Update availability status
    drug.isAvailable = drug.stock.quantity > 0;

    await drug.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: drug,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating stock',
      error: error.message,
    });
  }
};
