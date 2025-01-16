import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [studentDetails, setStudentDetails] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenSemesters, setHiddenSemesters] = useState([]);
   const [assessmentData, setAssessmentData] = useState({});
  const subjectCodes = ["CS101", "CS102", "ECE201", "MECH301", "EEE402", "CIVIL101"];
  const academicYears = ["2023-2024", "2024-2025"];

  const navigate = useNavigate();

  useEffect(() => {
    const rollNo = localStorage.getItem("studentRollNo");
    const dob = localStorage.getItem("studentDob");

    if (!rollNo || !dob) {
      navigate("/student-login");
      return;
    }

    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/details?rollNumber=${rollNo}`
        );
        if (response.data.success) {
          setStudentDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjectData = async () => {
      const studentRollNo = localStorage.getItem("studentRollNo");
      if (!studentRollNo) {
        console.error("Missing roll number in localStorage.");
        navigate("/student-login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/subjects", {
          params: { studentRollNo },
        });

        const { success, subjectData } = response.data;
        if (success && subjectData) {
          // Process the data
          const dbSubjects = subjectData.subjects || [];

          // Initialize UI data
          const updatedSubjectData = Array.from({ length: 8 }, (_, index) =>
            dbSubjects.some((db) => db.semester === index + 1)
              ? [] // Remove table for matched semesters
              : subjectData[index] || []
          );

          setSubjectData(updatedSubjectData);
        } else {
          console.warn("No subject data found for the roll number.");
          setSubjectData(Array.from({ length: 8 }, () => []));
        }
      } catch (error) {
        console.error("Error fetching subject data:", error.response?.data?.message || error.message);
        // Initialize empty structure in case of failure
        setSubjectData(Array.from({ length: 8 }, () => []));
      }
    };
    const fetchAssessmentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/assessments?rollNo=${rollNo}`
        );
        if (response.data.success) {
          setAssessmentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error.message);
      }
    };

    fetchAssessmentData();
    fetchStudentDetails();
    fetchSubjectData();
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("studentDob");
    navigate("/student-login");
  };

  const handleTableChange = (semesterIndex, rowIndex, field, value) => {
    const updatedData = [...subjectData];
    if (!updatedData[semesterIndex]) updatedData[semesterIndex] = [];
    if (!updatedData[semesterIndex][rowIndex]) updatedData[semesterIndex][rowIndex] = {};
    updatedData[semesterIndex][rowIndex][field] = value;
    setSubjectData(updatedData);
  };

  const handleSave = () => {
    const studentRollNo = localStorage.getItem("studentRollNo");
    if (!studentRollNo) {
      console.error("Student roll number is missing.");
      return;
    }

    if (!Array.isArray(subjectData) || subjectData.length === 0) {
      console.error("Subject data is invalid or empty.");
      return;
    }

    // Flatten and validate subject data
    const validSubjects = subjectData.map((semesterData, semesterIndex) => ({
      semester: semesterIndex + 1,
      studentRollNo,
      subjects: semesterData
        .filter((subject) => subject && subject.subjectCode && subject.academicYear)
        .map((subject, rowIndex) => ({
          sNo: rowIndex + 1,
          subjectCode: subject.subjectCode,
          academicYear: subject.academicYear,
        })),
    }));

    // Hide semesters with no valid data
    const hiddenSemesters = validSubjects
      .filter((semester) => semester.subjects.length === 0)
      .map((semester) => semester.semester);
    setHiddenSemesters(hiddenSemesters);

    // Log for debugging
    console.log(validSubjects);

    // Pass validSubjects to the saveSubjects function
    saveSubjects(studentRollNo, validSubjects);
  };


  const saveSubjects = async (studentRollNo, subjects) => {
    try {
      console.log("Saving subjects:", { studentRollNo, subjects });

      const response = await axios.post("http://localhost:5000/api/subjects/save", {
        studentRollNo,
        subjectData: subjects,
      });

      console.log("Response from server:", response.data.message);
      alert("Subjects saved successfully!");
    } catch (error) {
      console.error(
        "Error saving subjects:",
        error.response?.data?.message || error.message
      );
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <p>Loading data...</p>;
    }

    switch (selectedTab) {
      case "details":
        return (
          <div className="details-tab">
            <h2>Student Details</h2>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
            {studentDetails ? (
              <>
                <p>
                  <strong>Name:</strong> {studentDetails.name}
                </p>
                <p>
                  <strong>DOB:</strong> {studentDetails.dob}
                </p>
                <p>
                  <strong>Roll Number:</strong> {studentDetails.rollNumber}
                </p>
                <p>
                  <strong>Register Number:</strong> {studentDetails.registerNumber}
                </p>
                <p>
                  <strong>Branch:</strong> {studentDetails.branch || "N/A"}
                </p>
                <p>
                  <strong>Section:</strong> {studentDetails.section}
                </p>
                <strong>Counsellor Name's:</strong>
                <ul>
                  <li><strong>1st Year:</strong> {studentDetails.counselorNames.firstYear}</li>
                  <li><strong>2nd Year:</strong> {studentDetails.counselorNames.secondYear}</li>
                  <li><strong>3rd Year:</strong> {studentDetails.counselorNames.thirdYear}</li>
                  <li><strong>4th Year:</strong> {studentDetails.counselorNames.finalYear}</li>
                </ul>
              </>
            ) : (
              <p>No details available.</p>
            )}
          </div>
        );

      case "attendance":
        return (
          <div className="attendance-tab">
            <h2>Attendance Percentage</h2>
            <p>Coming soon!</p>
          </div>
        );

      case "results":
        return (
          <div className="results-tab">
            <h2>Results</h2>
            {Object.keys(assessmentData).length > 0 ? (
              Object.entries(assessmentData).map(([semester, subjects]) => (
                <div key={semester} className="semester-results">
                  <h3>Semester {semester}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>CAT1</th>
                        <th>CAT2</th>
                        <th>MODEL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.subjectCode}</td>
                          <td>{subject.CAT1 || "N/A"}</td>
                          <td>{subject.CAT2 || "N/A"}</td>
                          <td>{subject.MODEL || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No assessment data available.</p>
            )}
          </div>
        );


      case "subjects":
        return (
          <div className="subjects-tab">
            <h2>Subjects</h2>
            {Array.from({ length: 8 }).map((_, semesterIndex) => {
              if (hiddenSemesters.includes(semesterIndex)) {
                return null; // Skip rendering for hidden semesters
              }

              return (
                <div key={semesterIndex} className="semester-table">
                  <h3>Semester {semesterIndex + 1}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Subject Code</th>
                        <th>Academic Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 8 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{rowIndex + 1}</td>
                          <td>
                            <input
                              list={`subjectCodes${semesterIndex}${rowIndex}`}
                              value={subjectData[semesterIndex]?.[rowIndex]?.subjectCode || ""}
                              onChange={(e) =>
                                handleTableChange(semesterIndex, rowIndex, "subjectCode", e.target.value)
                              }
                            />
                            <datalist id={`subjectCodes${semesterIndex}${rowIndex}`}>
                              {subjectCodes.map((code) => (
                                <option key={code} value={code} />
                              ))}
                            </datalist>
                          </td>
                          <td>
                            <select
                              value={subjectData[semesterIndex]?.[rowIndex]?.academicYear || ""}
                              onChange={(e) =>
                                handleTableChange(semesterIndex, rowIndex, "academicYear", e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              {academicYears.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        );


      default:
        return <p>Select a tab to view content.</p>;
    }
  };
  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <button onClick={() => setSelectedTab("details")}>Details</button>
        <button onClick={() => setSelectedTab("subjects")}>Subjects</button>
        <button onClick={() => setSelectedTab("attendance")}>
          Attendance Percentage
        </button>
        <button onClick={() => setSelectedTab("results")}>Results</button>
      </div>
      <div className="main-content">{renderTabContent()}</div>
    </div>
  );
};

export default StudentDashboard;
