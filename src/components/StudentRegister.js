import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
import { useNavigate } from 'react-router-dom';



const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    dob: "",
    registerNumber: "",
    branch: "",
    yearOfEntry: "",
    fatherName: "",
    fatherOccupation: "",
    educationOccupation: "",
    familyBackground: "",
    parentPhoneNo: "",
    address: "",
    languagesKnown: "",
    guardianName: "",
    lastSchoolName: "",
    mediumOfInstructions: "",
    marksInPlusTwo: {
      maths: "",
      physics: "",
      chemistry: "",
      cutOff: "",
      quota: "",
    },
    counselorNames: {
      firstYear: "",
      secondYear: "",
      thirdYear: "",
      finalYear: "",
    },
    currentSemester: "",
    semesterSubjects: {},
  });

 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [group, key] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [group]: {
          ...prevState[group],
          [key]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddSubject = (semesterNum) => {
    setFormData((prevFormData) => {
      const updatedSemesterSubjects = { ...prevFormData.semesterSubjects };
      if (!updatedSemesterSubjects[semesterNum]) {
        updatedSemesterSubjects[semesterNum] = [];
      }
      updatedSemesterSubjects[semesterNum].push(""); // Add a new empty subject
      return { ...prevFormData, semesterSubjects: updatedSemesterSubjects };
    });
  };

  const handleSubjectChange = (semesterNum, idx, value) => {
    setFormData((prevFormData) => {
      const updatedSemesterSubjects = { ...prevFormData.semesterSubjects };
      if (!updatedSemesterSubjects[semesterNum]) {
        updatedSemesterSubjects[semesterNum] = [];
      }
      updatedSemesterSubjects[semesterNum][idx] = value;
      return { ...prevFormData, semesterSubjects: updatedSemesterSubjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Process semesterSubjects into semesters array
      const semesters = Object.keys(formData.semesterSubjects).map((semesterNum) => ({
        semester: parseInt(semesterNum, 10),
        subjects: formData.semesterSubjects[semesterNum],
      }));
  
      // Prepare the payload with additional data
      const payload = { ...formData, semesters };
      console.log("Submitting payload:", payload);
      console.log("Payload before submission:", JSON.stringify(payload, null, 2));

      // Send the registration data to the server
      const response = await axios.post("http://localhost:5000/api/students/register", payload);
      console.log("Registration successful:", response.data);
  
      // Show success message and navigate to the login page
      alert("Student registered successfully!");
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };
  
  const renderSubjectTables = () => {
    const semester = parseInt(formData.currentSemester, 10) || 0;
    if (semester > 8 || semester <= 0) return null;

    return Array.from({ length: semester }, (_, index) => {
      const semesterNum = index + 1;
      const subjects = formData.semesterSubjects[semesterNum] || [];
      return (
        <div key={`semester-${semesterNum}`} className="semester-table">
          <h4>Semester {semesterNum}</h4>
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject Code</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, idx) => (
                <tr key={`semester-${semesterNum}-row-${idx}`}>
                  <td>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) =>
                        handleSubjectChange(semesterNum, idx, e.target.value)
                      }
                      placeholder={`Subject ${idx + 1}`}
                      className="subject-input"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="add-subject-button"
            onClick={() => handleAddSubject(semesterNum)}
          >
            Add Subject Code
          </button>
        </div>
      );
    });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Student Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Student Details */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="register-input"
          />
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Roll Number"
            className="register-input"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="text"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="Register Number"
            className="register-input"
          />
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="register-input"
          />
          <input
            type="text"
            name="yearOfEntry"
            value={formData.yearOfEntry}
            onChange={handleChange}
            placeholder="Year of Entry"
            className="register-input"
          />
          {/* Parent and Background Details */}
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Father's Name"
            className="register-input"
          />
          <input
            type="text"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            placeholder="Father's Occupation"
            className="register-input"
          />
          <input
            type="text"
            name="educationOccupation"
            value={formData.educationOccupation}
            onChange={handleChange}
            placeholder="educationOccupation"
            className="register-input"
          />
          <textarea
            name="familyBackground"
            value={formData.familyBackground}
            onChange={handleChange}
            placeholder="Family Background"
            className="register-input"
          />
          <input
            type="text"
            name="parentPhoneNo"
            value={formData.parentPhoneNo}
            onChange={handleChange}
            placeholder="Parent's Phone Number"
            className="register-input"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="register-input"
          />
          <input
            type="text"
            name="languagesKnown"
            value={formData.languagesKnown}
            onChange={handleChange}
            placeholder="Languages Known"
            className="register-input"
          />
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            placeholder="guardianName"
            className="register-input"
          />
          <input
            type="text"
            name="lastSchoolName"
            value={formData.lastSchoolName}
            onChange={handleChange}
            placeholder="lastSchoolName"
            className="register-input"
          />
          <input
            type="text"
            name="mediumOfInstructions"
            value={formData.mediumOfInstructions}
            onChange={handleChange}
            placeholder="mediumOfInstructions"
            className="register-input"
          />
          {/* Academic Details */}
          <input
            type="text"
            name="marksInPlusTwo.maths"
            value={formData.marksInPlusTwo.maths}
            onChange={handleChange}
            placeholder="Marks in Maths"
            className="register-input"
          />
          <input
            type="text"
            name="marksInPlusTwo.physics"
            value={formData.marksInPlusTwo.physics}
            onChange={handleChange}
            placeholder="Marks in Physics"
            className="register-input"
          />
          <input
            type="text"
            name="marksInPlusTwo.chemistry"
            value={formData.marksInPlusTwo.chemistry}
            onChange={handleChange}
            placeholder="Marks in Chemistry"
            className="register-input"
          />
          <input
            type="text"
            name="marksInPlusTwo.cutOff"
            value={formData.marksInPlusTwo.cutOff}
            onChange={handleChange}
            placeholder="CutOff"
            className="register-input"
          />
          <input
            type="text"
            name="marksInPlusTwo.quota"
            value={formData.marksInPlusTwo.quota}
            onChange={handleChange}
            placeholder="quota"
            className="register-input"
          />
          {/* Counselor Names */}
          <input
            type="text"
            name="counselorNames.firstYear"
            value={formData.counselorNames.firstYear}
            onChange={handleChange}
            placeholder="Counselor Name (1st Year)"
            className="register-input"
          />
          <input
            type="text"
            name="counselorNames.secondYear"
            value={formData.counselorNames.secondYear}
            onChange={handleChange}
            placeholder="Counselor Name (2nd Year)"
            className="register-input"
          />
          <input
            type="text"
            name="counselorNames.thirdYear"
            value={formData.counselorNames.thirdYear}
            onChange={handleChange}
            placeholder="Counselor Name (3rd Year)"
            className="register-input"
          />
          <input
            type="text"
            name="counselorNames.finalYear"
            value={formData.counselorNames.finalYear}
            onChange={handleChange}
            placeholder="Counselor Name (Final Year)"
            className="register-input"
          />
          {/* Current Semester */}
          <input
            type="number"
            name="currentSemester"
            value={formData.currentSemester}
            onChange={handleChange}
            placeholder="Current Semester"
            className="register-input"
          />
          {renderSubjectTables()}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
