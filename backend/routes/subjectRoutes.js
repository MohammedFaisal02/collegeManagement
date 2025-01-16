const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// Save a subject to the database
const saveSubjectToDatabase = async (studentRollNo, subject) => {
  try {
    // Check if a record for the student already exists
    let studentRecord = await Subject.findOne({ studentRollNo });

    if (!studentRecord) {
      // If no record exists, create a new one
      studentRecord = new Subject({
        studentRollNo,
        subjects: [],
      });
    }

    // Add the subject to the student's record
    studentRecord.subjects.push(subject);
    await studentRecord.save();

    console.log("Subject saved successfully");
  } catch (error) {
    console.error("Error saving subject to database:", error.message);
    throw error;
  }
};

// Save subjects
router.post("/save", async (req, res) => {
  const { studentRollNo, subjectData } = req.body;

if (!Array.isArray(subjectData) || subjectData.length === 0) {
  return res.status(400).json({ success: false, message: "Invalid subject data" });
}

try {
  for (const semester of subjectData) {
    const { semester: sem, subjects } = semester;

    // Upsert: Replace the existing semester data or insert new
    await Subject.findOneAndUpdate(
      { studentRollNo, semester: sem },
      { studentRollNo, semester: sem, subjects },
      { upsert: true, new: true }
    );
  }

  res.status(200).json({ success: true, message: "Subjects saved successfully" });
} catch (error) {
  console.error("Error saving subjects:", error.message);
  res.status(500).json({ success: false, message: "Failed to save subjects" });
}

});

// Fetch subjects
router.get("/", async (req, res) => {
  const { studentRollNo } = req.query;

  if (!studentRollNo) {
    return res.status(400).json({ success: false, message: "Missing roll number" });
  }

  try {
    const subjects = await Subject.find({ studentRollNo }).sort({ semester: 1 });
const subjectData = Array.from({ length: 8 }, (_, index) => {
  const semester = subjects.find((s) => s.semester === index + 1);
  return semester ? semester.subjects : [];
});
res.json({ success: true, subjectData });

  } catch (error) {
    console.error("Error fetching subjects:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
