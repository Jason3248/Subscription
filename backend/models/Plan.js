const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: {
    type: [String],
    default: []
  },
  duration: {
    type: Number, 
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Plan', planSchema);
