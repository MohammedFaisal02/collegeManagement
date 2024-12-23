const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController'); // Adjust path if needed
const Student = require('../models/Student');
// POST route for registering a student
router.post('/register', StudentController.registerStudent);

// POST route for student login
router.post('/login', StudentController.loginStudent);

router.get('/details', async (req, res) => {
    const { rollNumber } = req.query;
  
    console.log("Incoming request for rollNumber:", rollNumber);
  
    try {
        if (!rollNumber) {
            return res.status(400).json({ success: false, message: "Roll number is required" });
        }
  
        const student = await Student.findOne({ rollNumber });
  
        if (!student) {
            console.warn("No student found for rollNumber:", rollNumber);
            return res.status(404).json({ success: false, message: "Student not found" });
        }
  
        return res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error("Internal server error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  


module.exports = router;
