const mongoose = require('mongoose');

const faceDataSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  encoding: { type: [Number], required: true },
  attendance: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FaceData', faceDataSchema);

