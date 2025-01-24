const Hall = require('../models/Hall');
const HallRequest = require('../models/HallRequest');

// Admin Controllers
exports.createHall = async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json({ status: 'success', hall });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateHall = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', hall });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteHall = async (req, res) => {
  try {
    await Hall.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.allocateHall = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Get the request details
    const request = await HallRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Hall request not found' });
    }

    const hall = await Hall.findByIdAndUpdate(
      request.hall,
      {
        status: 'allocated',
        allocatedTo: {
          lecturer: request.lecturer,
          examTitle: request.examTitle,
          allocatedAt: Date.now(),
        },
      },
      { new: true }
    );

    // Update request status to approved
    console.log(requestId);
    await HallRequest.findByIdAndUpdate(requestId, { status: 'approved' });

    res.status(200).json({ status: 'success', hall });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeAllocation = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(
      req.params.id,
      {
        status: 'available',
        allocatedTo: null,
      },
      { new: true }
    );
    await HallRequest.deleteMany({hall: req.params.id, status: 'approved'});
    res.status(200).json({ status: 'success', hall });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all hall requests (admin only)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await HallRequest.find({status: 'pending'})
      .populate('hall', 'name location')
      .populate('lecturer', 'fullName email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: requests.length,
      requests
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Lecturer Controllers
exports.requestHall = async (req, res) => {
  try {
    const request = await HallRequest.create({
      lecturer: req.user._id,
      hall: req.params.hallId,
      examTitle: req.body.examTitle,
    });
    res.status(201).json({ status: 'success', request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all requests made by the logged-in lecturer
exports.getLecturerRequests = async (req, res) => {
  try {
    const requests = await HallRequest.find({ lecturer: req.user._id, status: 'pending' })
      .populate('hall', 'name location')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      requests
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific request made by the lecturer
exports.deleteRequest = async (req, res) => {
  try {
    const request = await HallRequest.findOne({
      _id: req.params.id,
      lecturer: req.user._id
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found or you are not authorized to delete this request'
      });
    }

    await request.deleteOne();
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all halls allocated to the logged-in lecturer
exports.getLecturerHalls = async (req, res) => {
  try {
    const halls = await Hall.find({
      'allocatedTo.lecturer': req.user._id,
      status: 'allocated'
    });

    res.status(200).json({
      status: 'success',
      halls
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Common Controllers
exports.getHalls = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const halls = await Hall.find(query).populate('allocatedTo.lecturer', 'fullName email');
    res.status(200).json({ status: 'success', halls });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 