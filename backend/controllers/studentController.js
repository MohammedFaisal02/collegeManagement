const Student = require('../models/Student');

exports.registerStudent = async (req, res) => {
  const {
    name,
    rollNumber,
    dob,
    registerNumber,
    branch,
    section,
    yearOfEntry,
    fatherName,
    fatherOccupation,
    educationOccupation,
    familyBackground,
    parentPhoneNo,
    address,
    languagesKnown,
    guardianName,
    lastSchoolName,
    mediumOfInstructions,
    marksInPlusTwo,
    counselorNames,
  } = req.body;

  try {
    // Log incoming request data for debugging
    console.log("Incoming request for student registration:", req.body);

    // Basic validation for required fields
    if (!name || !rollNumber || !dob || !registerNumber || !branch) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newStudent = new Student({
      name,
      rollNumber,
      dob,
      registerNumber,
      branch,
      section,
      yearOfEntry,
      fatherName,
      fatherOccupation,
      educationOccupation,
      familyBackground,
      parentPhoneNo,
      address,
      languagesKnown,
      guardianName,
      lastSchoolName,
      mediumOfInstructions,
      marksInPlusTwo,
      counselorNames,
    });

    // Save to the database
    const savedStudent = await newStudent.save();
    console.log("Student saved successfully:", savedStudent);

    // Respond with the created student object
    res.status(201).json({
      message: "Student registered successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error during student registration:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login student
exports.loginStudent = async (req, res) => {
  const { rollNumber, dob } = req.body;

  try {
    // Log login request data for debugging
    console.log("Incoming login request:", req.body);

    // Check for required fields
    if (!rollNumber || !dob) {
      return res.status(400).json({ message: "Roll number and DOB are required" });
    }

    // Find student in the database
    const student = await Student.findOne({ rollNumber, dob });
    if (!student) {
      console.log("Invalid login attempt:", { rollNumber, dob });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with a success message
    console.log("Login successful for student:", student);
    res.status(200).json({
      message: "Login successful",
      student,
    });
  } catch (error) {
    console.error("Error during student login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
