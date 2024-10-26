import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Signin.css';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignIn = async () => {
    try {
      // Make a POST request to the backend for login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      // On success, redirect to /userpage
      navigate(`/userpage`, { state: { user: response.data.user } });
    } catch (error) {
      // Set the error message if the request fails
      setError(error.response?.data?.message || 'Sign-in failed');
    }
  };

  return (
    <div className="signin-container">
      <button onClick={() => setRole('employee')}>Sign in as Employee</button>
      <button onClick={() => setRole('manager')}>Sign in as Manager</button>

      {role && (
        <div className="signin-form">
          <h3>Sign in as {role}</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Signin;
