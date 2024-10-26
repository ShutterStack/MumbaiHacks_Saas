// Userpage.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CentredTabs from './CentredTabs';
import CreateTeamForm from './CreateTeamForm';
import axios from 'axios';

const Userpage = ({ user }) => {
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);

  const handleTeamCreateClick = () => {
    setShowCreateTeamForm(true);
  };

  const handleCreateTeam = async (teamData) => {
    try {
      await axios.post('http://localhost:5000/api/teams', teamData); // Adjust the endpoint accordingly
      alert('Team created successfully');
    } catch (error) {
      console.error('Error creating team', error);
      alert('Failed to create team');
    }
  };

  return (
    <div className="userpage">
      <Sidebar onTeamCreateClick={handleTeamCreateClick} />
      <div className="content">
        {showCreateTeamForm && (
          <CreateTeamForm
            onClose={() => setShowCreateTeamForm(false)}
            managerName={user.name}
            onSubmit={handleCreateTeam}
          />
        )}
        <CentredTabs />
        {/* Add more content here as needed */}
      </div>
    </div>
  );
};

export default Userpage;
