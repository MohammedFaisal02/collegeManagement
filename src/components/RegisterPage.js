import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css';
 

const RegisterPage = () => {
    return (
        <div className="form-container">
            <h2>Registration Page</h2>
            <div className="register-options">
                <Link to="/student-register">
                    <button>Register as Student</button>
                </Link>
                <Link to="/faculty-register">
                    <button>Register as Faculty</button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
