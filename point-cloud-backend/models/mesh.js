const mongoose = require('mongoose');

const dot = new mongoose.Schema({
  position: {
    type: [Number],
    required: true
  },
  id: {
    type: String,
    required: true
  },
});
// Define the schema for the data
const meshSchema = new mongoose.Schema({
  position: {
    type: [Number],
    required: true
  },
  rotation: {
    type: [Number],
    required: true
  },
  scale: {
    type: [Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  isMeasurement: {
    type: Boolean,
    required: false
  },
  point1: {
    type: [Number],
    required: false
  },
  point2: {
    type: [Number],
    required: false
  }


});

// Create the model using the schema
const Mesh = mongoose.model('Mesh', meshSchema);

module.exports = Mesh;
