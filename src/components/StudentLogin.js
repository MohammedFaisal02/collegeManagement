import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentLogin.css';

const StudentLogin = () => {
    const [rollNo, setRollNo] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/students/login', {
                rollNumber: rollNo,
                dob: dob,
            });
    
            console.log("Server Response:", response.data);
    
            if (response.data) {
                console.log("Navigating to /student-dashboard");
                localStorage.setItem('studentRollNo', rollNo);
                localStorage.setItem('studentDob', dob);
                navigate('/student-dashboard');
            } else {
                setError(response.data.message || 'Invalid credentials');
            }
        } catch (error) {
            if (error.response) {
                console.error("Error Response:", error.response.data);
                setError(error.response.data.message || 'Login failed. Please try again.');
            } else {
                console.error("Error during login:", error.message);
                setError('Unable to connect to the server.');
            }
        }
    };
    

    return (
      <form onSubmit={handleSubmit}>
          <h1><strong>Student Login</strong></h1>
          <input
              type="text"
              placeholder="Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
          />
          <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
      </form>
  );
};

export default StudentLogin;
