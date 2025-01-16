const express = require('express');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Assessment = require('../models/Assessment');
const jwt = require('jsonwebtoken');

const router = express.Router();


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

// Route to fetch students based on branch, section, subjectCode, academicYear, and semester
router.get('/students', async (req, res) => {
  const { branch, section, subjectCode, academicYear, semester } = req.query;

  if (!branch || !section || !subjectCode || !academicYear || !semester) {
    return res.status(400).send({ error: 'Branch, section, subject code, academic year, and semester are required' });
  }

  try {
    // Fetch the students who match the filters
    const studentsWithSubject = await Subject.find({
      "subjects.subjectCode": subjectCode,
      "subjects.academicYear": academicYear,
      semester: parseInt(semester), // Ensure semester is a number
    });
    
    if (!studentsWithSubject.length) {
      return res.status(404).send({ error: 'No students found with the given filters' });
    }

    // Now, find the students in your 'Student' collection based on the filtered results
    const studentRollNos = studentsWithSubject.map((subject) => subject.studentRollNo);
    
    const students = await Student.find({
      rollNumber: { $in: studentRollNos }, // Match roll numbers from the list
      branch: branch, // Match branch
      section: section, // Match section
    });
    
    if (!students.length) {
      return res.status(404).send({ error: 'No students found in the specified branch and section' });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});


router.post('/add', async (req, res) => {
  const { branch, section, semester, subjectCode, assessments } = req.body;

  // Validate input
  if (!branch || !section || !semester || !subjectCode || !assessments || !assessments.length) {
    return res.status(400).send({ error: 'Branch, section, semester, subjectCode, and assessments are required.' });
  }

  try {
    // Prepare assessment data for insertion
    const assessmentData = assessments.map((item) => ({
      rollNo: item.rollNo,
      branch,
      section,
      semester,
      subjectCode,
      marks: {
        CAT1: item.CAT1,
        CAT2: item.CAT2,
        MODEL: item.MODEL,
      },
    }));

    // Insert assessments into the database
    const result = await Assessment.insertMany(assessmentData);

    res.status(201).send({ message: 'Assessments stored successfully!', result });
  } catch (err) {
    console.error('Error saving assessments:', err);
    res.status(500).send({ error: 'Internal server error.' });
  }
});




module.exports = router;
