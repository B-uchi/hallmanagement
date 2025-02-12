const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'allocated'],
    default: 'available',
  },
  allocatedTo: {
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    examTitle: String,
    examDate: Date,
    allocatedAt: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema); 