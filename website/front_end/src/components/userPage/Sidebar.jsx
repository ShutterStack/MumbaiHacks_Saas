// Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ onTeamCreateClick }) => {
  return (
    <div className="sidebar">
      <h2>Manager Dashboard</h2>
      <ul>
        <li>
          <Link to="/homepage">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
        <Link to="/create-team">Create-Team</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
