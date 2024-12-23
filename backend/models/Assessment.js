// models/Assessment.js
const mongoose = require('mongoose');

// Define the schema for the assessment table
const assessmentSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjectCode: { type: String, required: true },
  students: [
    {
      rollNumber: { type: String, required: true },
      name: { type: String, required: true },
    }
  ]
});

// Create and export the model
const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
