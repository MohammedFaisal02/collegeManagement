import React, { useState } from 'react';
import '../styles/Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    handlingSemesters: [],  // Changed from handlingYears to handlingSemesters
    subjectNames: [{ name: '', code: '', semester: '' }]  // Added semester to subjectNames
  });

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle subject changes
  const handleSubjectChange = (index, e) => {
    const newSubjectNames = [...formData.subjectNames];
    newSubjectNames[index][e.target.name] = e.target.value;
    setFormData({ ...formData, subjectNames: newSubjectNames });
  };

  // Handle semester changes
  const handleSemesterChange = (index, e) => {
    const newSemesters = [...formData.handlingSemesters];
    newSemesters[index] = e.target.value;
    setFormData({ ...formData, handlingSemesters: newSemesters });
  };

  // Add new subject row
  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjectNames: [...formData.subjectNames, { name: '', code: '', semester: '' }]
    });
  };

  // Add new semester row
  const handleAddSemester = () => {
    setFormData({
      ...formData,
      handlingSemesters: [...formData.handlingSemesters, '']
    });
  };
 const navigate = useNavigate();
  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/faculty/register', formData);
      console.log('Registration successful:', response.data);
      alert('Faculty registered successfully');
      navigate('/');
    } catch (err) {
      console.error('Error registering faculty:', err);
      alert('Error occurred while registering');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Faculty Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* Faculty name */}
          <input
            type="text"
            placeholder="Faculty Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="register-input"
            required
          />
          {/* Faculty email */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
          />
          {/* Faculty password */}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            required
          />
          {/* Faculty branch */}
          <input
            type="text"
            placeholder="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="register-input"
            required
          />

          {/* Handling semesters */}
          <button type="button" onClick={handleAddSemester}>Add Semester</button>
          {formData.handlingSemesters.map((semester, index) => (
            <div key={index}>
              <input
                type="text"
                value={semester}
                onChange={(e) => handleSemesterChange(index, e)}
                placeholder="Handling Semester"
                required
              />
            </div>
          ))}

          {/* Adding subjects */}
          <button type="button" onClick={handleAddSubject}>Add Subject</button>
          {formData.subjectNames.map((subject, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, e)}
                placeholder="Subject Name"
                required
              />
              <input
                type="text"
                name="code"
                value={subject.code}
                onChange={(e) => handleSubjectChange(index, e)}
                placeholder="Subject Code"
                required
              />
              <input
                type="text"
                name="semester"
                value={subject.semester}
                onChange={(e) => handleSubjectChange(index, e)}
                placeholder="Semester"
                required
              />
            </div>
          ))}

          {/* Submit button */}
          <button type="submit" className="register-btn">Register Faculty</button>
        </form>
      </div>
    </div>
  );
};

export default FacultyRegister;
