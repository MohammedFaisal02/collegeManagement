const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  registerNumber: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  yearOfEntry: { type: String, required: true },
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  educationOccupation: { type: String, required: true },
  familyBackground: { type: String, required: true },
  parentPhoneNo: { type: String, required: true },
  address: { type: String, required: true },
  languagesKnown: { type: String, required: true },
  guardianName: { type: String, required: false },
  lastSchoolName: { type: String, required: true },
  mediumOfInstructions: { type: String, required: true },
  marksInPlusTwo: {
    maths: { type: Number, required: true },
    physics: { type: Number, required: true },
    chemistry: { type: Number, required: true },
    cutOff: { type: Number, required: true },
    quota: { type: String, required: true },
  },
  counselorNames: {
    firstYear: { type: String, required: true },
    secondYear: { type: String, required: true },
    thirdYear: { type: String, required: true },
    finalYear: { type: String, required: true },
  },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
