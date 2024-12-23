const express = require('express');
const Faculty = require('../models/Faculty');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { updateAssessment } = require('../controllers/facultyController'); // Import the controller function

// Route for updating the assessment table
router.post('/assessment/update', updateAssessment);


// Faculty Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, branch, handlingSemesters, subjectNames } = req.body;

  try {
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const newFaculty = new Faculty({
      name,
      email,
      password, // Store password directly (NOT recommended for production)
      branch,
      handlingSemesters,
      subjectNames,
    });

    await newFaculty.save();
    res.status(201).json({ message: 'Faculty registered successfully' });
  } catch (error) {
    console.error('Error registering faculty:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Faculty Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
      return res.status(400).json({ message: 'Faculty not found' });
    }

    if (faculty.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: faculty._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      facultyDetails: {
        name: faculty.name,
        email: faculty.email,
        branch: faculty.branch,
        handlingSemesters: faculty.handlingSemesters,
        subjectNames: faculty.subjectNames,
      },
    });
  } catch (err) {
    console.error('Error in faculty login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch faculty details by email
router.get('/details', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).send({ error: 'Faculty not found' });
    }
    res.status(200).json(faculty);
  } catch (err) {
    console.error('Error fetching faculty details:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Route to fetch semesters handled by the faculty
router.get('/semesters', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).send({ error: 'Faculty not found' });
    }
    res.status(200).json(faculty.handlingSemesters || []);
  } catch (err) {
    console.error('Error fetching semesters:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Route to fetch subjects for a specific semester
router.get('/subjects', async (req, res) => {
  const { semester, email } = req.query;

  if (!email || !semester) {
    return res.status(400).send({ error: 'Email and semester are required' });
  }

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).send({ error: 'Faculty not found' });
    }

    const subjects = faculty.subjectNames?.filter((subject) => subject.semester === semester) || [];
    res.status(200).json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
