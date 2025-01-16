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
    section: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {


      // Send the registration data to the server
      const response = await axios.post("http://localhost:5000/api/students/register", formData);
      console.log("Registration successful:", response.data);

      // Show success message and navigate to the login page
      alert("Student registered successfully!");
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
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
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="register-input"
          >
            <option value="" disabled>Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="Section"
            className="register-input"
          >
            <option value="" disabled>
              Select Section
            </option>
            {formData.branch === "CSE" && (
              <>
                <option value="CSE-A">CSE-A</option>
                <option value="CSE-B">CSE-B</option>
              </>
            )}
            {formData.branch === "ECE" && (
              <>
                <option value="ECE-A">ECE-A</option>
                <option value="ECE-B">ECE-B</option>
              </>
            )}
            {formData.branch === "EEE" && (
              <>
                <option value="EEE-A">EEE-A</option>
                <option value="EEE-B">EEE-B</option>
              </>
            )}
            {formData.branch === "MECH" && (
              <>
                <option value="MECH-A">MECH-A</option>
                <option value="MECH-B">MECH-B</option>
              </>
            )}
          </select>

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
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
