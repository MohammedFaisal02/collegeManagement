import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/LoginPage.css';

const LoginPage = () => {
    
    return (
        <div className="form-container">
            <h2>Login Page</h2>

            
                <div className="role-selection">
                    <h3>Select Your Role</h3>
                    <Link to="/student-login">
                        <button>Login as Student</button>
                    </Link>
                    <Link to="/faculty-login">
                        <button>Login as Faculty</button>
                    </Link>
                </div>
            
            <div className="register-section">
                <h4>Don't have an account?</h4>
                <Link to="/form-container">
                    <button>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
