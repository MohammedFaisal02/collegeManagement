import React, { useState } from 'react';
import axios from 'axios';

const FacultyForm = () => {
  // Track form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    handlingSemesters: [],
    subjectNames: [{ name: '', code: '', semester: '' }],
  });

  const [isLogin, setIsLogin] = useState(false); // Track whether the form is for login or registration

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle semester changes for subjects
  const handleSubjectChange = (index, e) => {
    const newSubjectNames = [...formData.subjectNames];
    newSubjectNames[index][e.target.name] = e.target.value;
    setFormData({ ...formData, subjectNames: newSubjectNames });
  };

  // Handle adding new subjects
  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjectNames: [...formData.subjectNames, { name: '', code: '', semester: '' }],
    });
  };

  // Handle submit for both login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isLogin ? 'login' : 'register'; // Determine whether it's login or register

    try {
      const response = await axios.post(`http://localhost:5000/api/faculty/${action}`, formData);
      console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, response.data);
      alert(`${isLogin ? 'Login' : 'Registration'} successful`);
    } catch (err) {
      console.error(`Error during ${isLogin ? 'login' : 'registration'}:`, err);
      alert(`Error occurred during ${isLogin ? 'login' : 'registration'}`);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>{isLogin ? 'Faculty Login' : 'Faculty Registration'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Faculty Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="register-input"
                required={!isLogin}
              />
              <input
                type="text"
                placeholder="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="register-input"
                required={!isLogin}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
            required
          />
          
          {!isLogin && (
            <>
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
            </>
          )}

          <button type="submit" className="register-btn">
            {isLogin ? 'Login' : 'Register Faculty'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default FacultyForm;
