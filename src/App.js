import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './components/StudentLogin';
import FacultyLogin from './components/FacultyLogin';
import StudentRegister from './components/StudentRegister';
import FacultyRegister from './components/FacultyRegister';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/form-container" element={<RegisterPage />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/faculty-login" element={<FacultyLogin />} />
                <Route path="/student-register" element={<StudentRegister />} />
                <Route path="/faculty-register" element={<FacultyRegister />} />
                <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;