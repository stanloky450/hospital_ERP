const Ward = require('../../models/ward/Ward');

/**
 * @desc    Get all wards
 * @route   GET /api/v1/wards
 * @access  Private
 */
exports.getWards = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, type, floor } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (floor) filter.floor = parseInt(floor);

    const skip = (page - 1) * limit;

    const wards = await Ward.find(filter)
      .populate('nurseInCharge', 'firstName lastName email phone')
      .populate('beds.patient', 'firstName lastName patientId')
      .sort({ floor: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Ward.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: wards.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: wards,
    });
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wards',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single ward
 * @route   GET /api/v1/wards/:id
 * @access  Private
 */
exports.getWard = async (req, res, next) => {
  try {
    const ward = await Ward.findById(req.params.id)
      .populate('nurseInCharge', 'firstName lastName email phone department')
      .populate('beds.patient', 'firstName lastName patientId email phone dateOfBirth gender bloodGroup');

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: 'Ward not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ward,
    });
  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ward',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new ward
 * @route   POST /api/v1/wards
 * @access  Private (Admin only)
 */
exports.createWard = async (req, res, next) => {
  try {
    const ward = await Ward.create(req.body);

    const populatedWard = await Ward.findById(ward._id)
      .populate('nurseInCharge', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Ward created successfully',
      data: populatedWard,
    });
  } catch (error) {
    console.error('Error creating ward:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating ward',
      error: error.message,
    });
  }
};

/**
 * @desc    Update ward
 * @route   PUT /api/v1/wards/:id
 * @access  Private (Admin/Nurse only)
 */
exports.updateWard = async (req, res, next) => {
  try {
    let ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: 'Ward not found',
      });
    }

    ward = await Ward.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('nurseInCharge', 'firstName lastName email phone')
      .populate('beds.patient', 'firstName lastName patientId');

    res.status(200).json({
      success: true,
      message: 'Ward updated successfully',
      data: ward,
    });
  } catch (error) {
    console.error('Error updating ward:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating ward',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete ward
 * @route   DELETE /api/v1/wards/:id
 * @access  Private (Admin only)
 */
exports.deleteWard = async (req, res, next) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: 'Ward not found',
      });
    }

    // Check if ward has any occupied beds
    const occupiedBeds = ward.beds.filter(bed => bed.isOccupied);
    if (occupiedBeds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete ward with occupied beds. Please discharge all patients first.',
      });
    }

    await ward.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ward deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Error deleting ward:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ward',
      error: error.message,
    });
  }
};

/**
 * @desc    Assign patient to bed
 * @route   PUT /api/v1/wards/:id/beds/:bedNumber/assign
 * @access  Private (Nurse/Receptionist/Cashier)
 */
exports.assignBed = async (req, res, next) => {
  try {
    const { id, bedNumber } = req.params;
    const { patientId } = req.body;

    const ward = await Ward.findById(id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: 'Ward not found',
      });
    }

    const bed = ward.beds.find(b => b.bedNumber === bedNumber);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found',
      });
    }

    if (bed.isOccupied) {
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied',
      });
    }

    // Assign patient to bed
    bed.patient = patientId;
    bed.isOccupied = true;
    bed.admissionDate = Date.now();

    // Update available beds count
    ward.availableBeds = ward.beds.filter(b => !b.isOccupied).length;

    await ward.save();

    const updatedWard = await Ward.findById(id)
      .populate('nurseInCharge', 'firstName lastName email phone')
      .populate('beds.patient', 'firstName lastName patientId');

    res.status(200).json({
      success: true,
      message: 'Patient assigned to bed successfully',
      data: updatedWard,
    });
  } catch (error) {
    console.error('Error assigning bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning bed',
      error: error.message,
    });
  }
};

/**
 * @desc    Discharge patient from bed
 * @route   PUT /api/v1/wards/:id/beds/:bedNumber/discharge
 * @access  Private (Nurse/Doctor)
 */
exports.dischargeBed = async (req, res, next) => {
  try {
    const { id, bedNumber } = req.params;

    const ward = await Ward.findById(id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: 'Ward not found',
      });
    }

    const bed = ward.beds.find(b => b.bedNumber === bedNumber);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found',
      });
    }

    if (!bed.isOccupied) {
      return res.status(400).json({
        success: false,
        message: 'Bed is already vacant',
      });
    }

    // Discharge patient from bed
    bed.patient = null;
    bed.isOccupied = false;
    bed.dischargeDate = Date.now();

    // Update available beds count
    ward.availableBeds = ward.beds.filter(b => !b.isOccupied).length;

    await ward.save();

    const updatedWard = await Ward.findById(id)
      .populate('nurseInCharge', 'firstName lastName email phone')
      .populate('beds.patient', 'firstName lastName patientId');

    res.status(200).json({
      success: true,
      message: 'Patient discharged from bed successfully',
      data: updatedWard,
    });
  } catch (error) {
    console.error('Error discharging bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error discharging bed',
      error: error.message,
    });
  }
};
