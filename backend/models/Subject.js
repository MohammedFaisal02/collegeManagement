// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  semester: { type: Number, required: true },
  subjects: [
    {
      sNo: { type: Number, required: true },
      subjectCode: { type: String, required: true },
      academicYear: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Subject", subjectSchema);
