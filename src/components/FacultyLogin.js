import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FacultyLogin.css'; // Ensure your styles are linked

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To show a loading spinner during API call
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API call to validate login
      const response = await axios.post('http://localhost:5000/api/faculty/login', {
        email,
        password,
      });

      const { token, facultyDetails } = response.data;

      // Save token and email to localStorage
      localStorage.setItem('facultyToken', token);
      localStorage.setItem('facultyEmail', facultyDetails.email);

      // Redirect to the faculty dashboard with faculty details passed as state
      navigate('/faculty-dashboard', { state: { facultyDetails } });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-login-container">
      <form onSubmit={handleSubmit} className="faculty-login-form">
        <h2>Faculty Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default FacultyLogin;
