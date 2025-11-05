const Appointment = require('../../models/appointment/Appointment');

/**
 * @desc    Get all appointments
 * @route   GET /api/v1/appointments
 * @access  Private
 */
exports.getAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, date, doctor, patient } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName patientId email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('staff', 'firstName lastName email')
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single appointment
 * @route   GET /api/v1/appointments/:id
 * @access  Private
 */
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName patientId email phone dateOfBirth gender')
      .populate('doctor', 'firstName lastName specialization consultationFee')
      .populate('staff', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message,
    });
  }
};

/**
 * @desc    Create new appointment
 * @route   POST /api/v1/appointments
 * @access  Private
 */
exports.createAppointment = async (req, res, next) => {
  try {
    // Add created by staff info
    req.body.createdBy = req.user._id;

    const appointment = await Appointment.create(req.body);

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'firstName lastName patientId email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('staff', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message,
    });
  }
};

/**
 * @desc    Update appointment
 * @route   PUT /api/v1/appointments/:id
 * @access  Private
 */
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('patient', 'firstName lastName patientId email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('staff', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete appointment
 * @route   DELETE /api/v1/appointments/:id
 * @access  Private
 */
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel appointment
 * @route   PUT /api/v1/appointments/:id/cancel
 * @access  Private
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = req.body.reason || 'No reason provided';
    appointment.cancelledBy = req.user._id;
    appointment.cancelledAt = Date.now();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'firstName lastName patientId email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('staff', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message,
    });
  }
};
