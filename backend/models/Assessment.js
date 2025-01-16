  const mongoose = require('mongoose');

  const assessmentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    semester: { type: Number, required: true },
    subjectCode: { type: String, required: true },
    branch: { type: String, required: true }, // Added branch field
    section: { type: String, required: true }, // Added section field
    marks: {
      CAT1: { type: Number, required: true },
      CAT2: { type: Number, required: true },
      MODEL: { type: Number, required: true },
    },
    date: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Assessment', assessmentSchema);
