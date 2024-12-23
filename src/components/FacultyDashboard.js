import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [facultyDetails, setFacultyDetails] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('facultyToken');
        const email = localStorage.getItem('facultyEmail');

        if (!token || !email) {
          console.error('Token or email missing, redirecting to login.');
          navigate('/faculty-login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch faculty details
        const detailsResponse = await axios.get(
          `http://localhost:5000/api/faculty/details?email=${email}`,
          { headers }
        );

        setFacultyDetails(detailsResponse.data);

        // Fetch semesters
        const semestersResponse = await axios.get(
          `http://localhost:5000/api/faculty/semesters?email=${email}`,
          { headers }
        );
        setSemesters(semestersResponse.data); // Expecting [1, 2, 3, ...]
      } catch (error) {
        console.error('Error during data fetch:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyEmail');
    navigate('/');
  };

  const handleSemesterSelect = async (semester) => {
    setSelectedSemester(semester);
    setSubjects([]);
    setStudents([]);

    if (!semester) return;

    try {
      const token = localStorage.getItem('facultyToken');
      const response = await axios.get(
        `http://localhost:5000/api/faculty/subjects?semester=${semester}&email=${localStorage.getItem('facultyEmail')}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(response.data); // Assuming response contains an array of subjects
    } catch (error) {
      console.error('Error fetching subjects:', error.message);
    }
  };

  const handleSubjectSelect = async (subjectCode) => {
    setSelectedSubject(subjectCode);
    setStudents([]);

    if (!subjectCode) return;

    try {
      const token = localStorage.getItem('facultyToken');
      const response = await axios.get(
        `http://localhost:5000/api/faculty/students?subjectCode=${subjectCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data); // Assuming response contains an array of students
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <p>Loading data...</p>;
    }

    switch (selectedTab) {
      case 'details':
        return (
          <div className="details-tab">
            <h2>Faculty Details</h2>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
            {facultyDetails ? (
              <>
                <p>
                  <strong>Name:</strong> {facultyDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {facultyDetails.email}
                </p>
                <p>
                  <strong>Branch:</strong> {facultyDetails.branch || 'N/A'}
                </p>
                <div>
                  <h3>
                    <strong>Handling Semesters:</strong>
                  </h3>
                  <ul>
                    {facultyDetails.handlingSemesters?.map((sem, idx) => (
                      <li key={idx}>{sem}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>
                    <strong>Subjects:</strong>
                  </h3>
                  <ul>
                    {facultyDetails.subjectNames?.map((subject, idx) => (
                      <li key={idx}>
                        <strong>{subject.name}</strong> ({subject.code})
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>No faculty details available.</p>
            )}
          </div>
        );

      case 'assessment':
        return (
          <div className="assessment-tab">
            <h2>Assessment</h2>
            <label>Select Semester:</label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterSelect(parseInt(e.target.value, 10))}
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            {selectedSemester && (
              <div>
                <label>Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedSubject && (
              <div>
                <h3>Students List:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Name</th>
                      <th>CAT 1</th>
                      <th>CAT 2</th>
                      <th>Model</th>
                      <th>Sem Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.rollNumber}</td>
                        <td>{student.name}</td>
                        <td>{student.cat1 || '-'}</td>
                        <td>{student.cat2 || '-'}</td>
                        <td>{student.model || '-'}</td>
                        <td>{student.semGrade || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'change-course':
        return <p>Change Course functionality coming soon!</p>;

      default:
        return <p>Select a tab to view content</p>;
    }
  };

  return (
    <div className="faculty-dashboard">
      <div className="sidebar">
        <button onClick={() => setSelectedTab('details')}>Details</button>
        <button onClick={() => setSelectedTab('assessment')}>Assessment</button>
        <button onClick={() => setSelectedTab('change-course')}>Change Course</button>
      </div>
      <div className="main-content">{renderTabContent()}</div>
    </div>
  );
};

export default FacultyDashboard;
