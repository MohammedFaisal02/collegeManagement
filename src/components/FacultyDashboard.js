import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [branches, setBranches] = useState(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']);
  const [academicYears, setAcademicYears] = useState(['2023-2024', '2024-2025']);
  const [semesters, setSemesters] = useState(['1', '2', '3', '4', '5', '6', '7', '8']);
  const [Sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectCodes, setSubjectCodes] = useState([
    'CS101', 'CS102', 'ECE201', 'MECH301', 'EEE402', 'CIVIL101',
  ]);
  const [filteredSubjectCodes, setFilteredSubjectCodes] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [facultyDetails, setFacultyDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedBranch) {
      const branchSections = {
        CSE: ['CSE-A', 'CSE-B', 'CSE-C'],
        ECE: ['ECE-A', 'ECE-B'],
        EEE: ['EEE-A', 'EEE-B'],
        MECH: ['MECH-A', 'MECH-B'],
        CIVIL: ['CIVIL-A', 'CIVIL-B'],
      };
      setSections(branchSections[selectedBranch] || []);
    } else {
      setSections([]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    setFilteredSubjectCodes(subjectCodes);
  }, [subjectCodes]);

  const handleSubjectCodeInput = (input) => {
    const filteredCodes = subjectCodes.filter((code) =>
      code.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredSubjectCodes(filteredCodes);
  };

  const handleFetchStudents = async () => {
    if (!selectedBranch || !selectedAcademicYear || !selectedSemester || !selectedSection || !selectedSubjectCode) {
      alert('Please select all filters.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/faculty/students', {
        params: {
          branch: selectedBranch,
          section: selectedSection,
          subjectCode: selectedSubjectCode,
          academicYear: selectedAcademicYear,
          semester: selectedSemester
        },
      });

      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessments = async () => {
    if (!selectedBranch || !selectedSection || !selectedSubjectCode || students.length === 0) {
      alert('Please select branch, section, and subject code, and ensure there are students.');
      return;
    }

    const assessments = students.map((student) => ({
      rollNo: student.rollNumber,
      CAT1: parseInt(student.CAT1 || 0), // Ensure numerical data is sent
      CAT2: parseInt(student.CAT2 || 0),
      MODEL: parseInt(student.MODEL || 0),
    }));

    try {
      await axios.post('http://localhost:5000/api/faculty/add', {
        branch: selectedBranch,
        section: selectedSection,
        semester: selectedSemester,
        subjectCode: selectedSubjectCode,
        assessments,
      });
      alert('Assessments stored successfully!');
    } catch (error) {
      console.error('Error saving assessments:', error.message);
      alert('Error saving assessments.');
    }
  };



  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents); // Update the state
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyEmail');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('facultyToken');
        const email = localStorage.getItem('facultyEmail');

        if (!token || !email) {
          console.error('Token or email missing, redirecting to login.');
          navigate('/faculty-login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const detailsResponse = await axios.get(
          `http://localhost:5000/api/faculty/details?email=${email}`,
          { headers }
        );
        setFacultyDetails(detailsResponse.data);
      } catch (error) {
        console.error('Error during data fetch:', error.message);
      }
    };

    fetchData();
  }, [navigate]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'assessment':
        return (
          <div className="assessment-tab">
            <h2>Assessment</h2>
            <b><label>Select Branch:</label></b>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
            <b><label>Select Academic Year:</label></b>
            <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)}>
              <option value="">-- Select Academic Year --</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <br></br>
            <b><label>Select Semester:</label></b>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>&emsp;&emsp;&emsp;
            <b><label>Select Section:</label></b>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="">-- Select Section --</option>
              {Sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <br></br>
            <b><label>Enter Subject Code:</label></b>
            <input
              type="text"
              value={selectedSubjectCode}
              onChange={(e) => {
                setSelectedSubjectCode(e.target.value);
                handleSubjectCodeInput(e.target.value);
              }}
              placeholder="Select Subject Code"
              list="subject-codes"
            />
            <datalist id="subject-codes">
              {filteredSubjectCodes.map((code) => (
                <option key={code} value={code} />
              ))}
            </datalist>

            <center><button className="submit-button" onClick={handleFetchStudents}>Submit</button></center>
            {students.length > 0 && (
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
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student._id}>
                        <td>{student.rollNumber}</td>
                        <td>{student.name}</td>
                        <td>
                          <input
                            type="number"
                            value={student.CAT1 || ''}
                            onChange={(e) => handleInputChange(index, 'CAT1', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={student.CAT2 || ''}
                            onChange={(e) => handleInputChange(index, 'CAT2', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={student.MODEL || ''}
                            onChange={(e) => handleInputChange(index, 'MODEL', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                <center><button className="submit-button" onClick={handleSaveAssessments}>Save Assessments</button></center>
              </div>
            )}
          </div>
        );

      case 'changeCourse':
        return (
          <div className="change-course-tab">
            <h2>Change Course</h2>
            <p>Feature to modify courses will be implemented here.</p>
          </div>
        );

      case 'details':
        return (
          <div className="details-tab">
            <h2>Faculty Details</h2>
            <button className="logout" onClick={handleLogout}>Logout</button>
            {facultyDetails ? (
              <>
                <p><strong>Name:</strong> {facultyDetails.name}</p>
                <p><strong>Email:</strong> {facultyDetails.email}</p>
                <p><strong>Branch:</strong> {facultyDetails.branch || 'N/A'}</p>
                <div>
                  <h3><strong>Handling Semesters:</strong></h3>
                  <ul>
                    {facultyDetails.handlingSemesters?.map((sem, idx) => (
                      <li key={idx}>{sem}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3><strong>Subjects:</strong></h3>
                  <ul>
                    {facultyDetails.subjects?.map((subject, idx) => (
                      <li key={idx}>{subject}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>Loading faculty details...</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="faculty-dashboard">
      <div className="sidebar">
        <button className="tab-button" onClick={() => setSelectedTab('details')}>Faculty Details</button>
        <button className="tab-button" onClick={() => setSelectedTab('assessment')}>Assessments</button>
        <button className="tab-button" onClick={() => setSelectedTab('changeCourse')}>Change Course</button>
      </div>
      <div className="content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;
