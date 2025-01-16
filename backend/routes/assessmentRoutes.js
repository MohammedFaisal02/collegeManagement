const express = require('express');
const router = express.Router();

const Assessment = require('../models/Assessment');

router.get("/assessments", async (req, res) => {
  const rollNumber = req.query.rollNo;

  if (!rollNumber) {
    return res.status(400).json({ success: false, message: "Roll number is required." });
  }

  try {
    // Find assessments for the given roll number
    const assessments = await Assessment.find({ rollNo: rollNumber });

    console.log("Fetched assessments:", assessments);

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ success: false, message: "No assessments found for the roll number." });
    }

    // Process the data to format by semester
    const formattedData = {};
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i];
      const { semester, subjectCode, marks } = assessment;

      if (!formattedData[semester]) {
        formattedData[semester] = [];
      }

      formattedData[semester].push({
        subjectCode,
        CAT1: marks.CAT1,
        CAT2: marks.CAT2,
        MODEL: marks.MODEL,
      });
    }
    console.log("Formatted data:", formattedData);
    return res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error in /api/assessments:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
module.exports = router;