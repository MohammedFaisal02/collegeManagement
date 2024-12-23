const Faculty = require('../models/Faculty');
const Assessment = require('../models/Assessment'); // Import the Assessment model


// Register Faculty
exports.registerFaculty = async (req, res) => {
    const { name, email, password, branch, handlingSemesters, subjectNames } = req.body;

    try {
        // Check if faculty already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }

        // Create a new Faculty instance
        const newFaculty = new Faculty({
            name,
            email,
            password, // Store password directly without hashing (consider using hashing in production)
            branch,
            handlingSemesters, // Add handlingSemesters
            subjectNames // Add subjectNames with semester, name, and code
        });

        // Save the new faculty document
        await newFaculty.save();

        // Send success response
        res.status(201).json({ message: 'Faculty registered successfully' });
    } catch (error) {
        console.error('Error registering faculty:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Faculty Details by Email
exports.getFacultyDetails = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty); // Send the faculty details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Semesters for Faculty
exports.getSemesters = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty.handlingSemesters); // Return the handlingSemesters (semesters managed by the faculty)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// facultyController.js

// Controller function to update the assessment table
const updateAssessment = async (req, res) => {
  const { semester, subjectCode, rollNumber, name } = req.body;

  try {
    // Find the relevant assessment table entry for the semester and subject code
    const assessment = await Assessment.findOne({ semester, subjectCode });

    if (assessment) {
      // Add student details (roll number and name) to the relevant subject
      assessment.students.push({ rollNumber, name });
      await assessment.save();
      res.status(200).send('Student added to assessment table');
    } else {
      res.status(404).send('Assessment record not found');
    }
  } catch (err) {
    console.error('Error updating assessment table:', err);
    res.status(500).send('Error updating assessment table');
  }
};

module.exports = { updateAssessment }; // Export the function

