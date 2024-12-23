import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [studentDetails, setStudentDetails] = useState(null);
  const [results] = useState({});
  const [loading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const rollNo = localStorage.getItem("studentRollNo");
const dob = localStorage.getItem("studentDob");
console.log("rollNo:", rollNo, "dob:", dob); // Check these values


    if (!rollNo || !dob) {
      console.error("No roll number or DOB found, redirecting to login.");
      navigate("/student-login");
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
           `http://localhost:5000/api/students/details?rollNumber=${rollNo}`
        );
  
        console.log("Response from API:", response.data);
  
        if (response.data.success) {
          setStudentDetails(response.data.data);
        } else {
          console.error("Error fetching student details:", response.data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    };
  
    fetchStudentDetails();
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("studentDob");
    navigate("/");
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
                  <strong>Semester:</strong> {studentDetails.currentSemester}
                </p>
              
                  <strong>Counsellor Name's:</strong>
                  <ul>
                    <li><strong>1st Year: </strong>{studentDetails.counselorNames.firstYear}</li> 
                    <li><strong>2nd Year:</strong>  {studentDetails.counselorNames.secondYear}</li>
                    <li><strong>3rd Year: </strong> {studentDetails.counselorNames.thirdYear}</li>
                    <li><strong>4th Year:</strong>  {studentDetails.counselorNames.finalYear}</li>         
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
            {Object.keys(results).length > 0 ? (
              <div className="results-container">
                {Object.keys(results).map((semester) => (
                  <div key={semester} className="semester-table">
                    <h3>Semester {semester}</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>CAT 1</th>
                          <th>CAT 2</th>
                          <th>Model</th>
                          <th>Sem Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results[semester].map((subject, index) => (
                          <tr key={index}>
                            <td>{subject.subjectCode}</td>
                            <td>{subject.cat1 || "-"}</td>
                            <td>{subject.cat2 || "-"}</td>
                            <td>{subject.model || "-"}</td>
                            <td>{subject.semGrade || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results available.</p>
            )}
          </div>
        );

      default:
        return <p>Select a tab to view content</p>;
    }
  };

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <button onClick={() => setSelectedTab("details")}>Details</button>
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
