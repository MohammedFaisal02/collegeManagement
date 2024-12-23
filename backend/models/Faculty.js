const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, required: true },
  handlingSemesters: { type: [String], required: true },  // Array of strings
  subjectNames: [
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      semester: { type: String, required: true }  // Added semester field
    }
  ]});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
