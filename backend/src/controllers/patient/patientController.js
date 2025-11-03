const Patient = require('../../models/patient/Patient');
const logger = require('../../config/logger');
const cacheService = require('../../services/redis/cacheService');

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const patients = await Patient.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select('-__v');

    const count = await Patient.countDocuments(query);

    res.status(200).json({
      success: true,
      count: patients.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: patients,
    });
  } catch (error) {
    logger.error(`Get patients error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
    });
  }
};

// @desc    Get single patient
// @route   GET /api/v1/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    const cacheKey = `patient:${req.params.id}`;
    const cachedPatient = await cacheService.get(cacheKey);

    if (cachedPatient) {
      return res.status(200).json({
        success: true,
        data: cachedPatient,
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await cacheService.set(cacheKey, patient, 1800);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    logger.error(`Get patient error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
    });
  }
};

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    // Generate patient ID
    const count = await Patient.countDocuments();
    const patientId = `PAT${String(count + 1).padStart(6, '0')}`;

    const patient = await Patient.create({
      ...req.body,
      patientId,
      registeredBy: req.user.id,
    });

    logger.info(`Patient created: ${patientId}`);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  } catch (error) {
    logger.error(`Create patient error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await cacheService.del(`patient:${req.params.id}`);

    logger.info(`Patient updated: ${patient.patientId}`);

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  } catch (error) {
    logger.error(`Update patient error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/v1/patients/:id
// @access  Private (Admin only)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await cacheService.del(`patient:${req.params.id}`);

    logger.info(`Patient deleted: ${patient.patientId}`);

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete patient error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
    });
  }
};
