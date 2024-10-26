// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import { Card, CardContent, Typography, Button } from '@mui/material';

const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teams');
        console.log('Fetched teams:', response.data);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // Function to handle navigation to CenteredTabs
  const handleViewDetails = () => {
    navigate('/centred-tabs'); // Navigate to the CenteredTabs without specifying a team
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
      {teams.map((team) => (
        <Card
          key={team._id}
          style={{
            cursor: 'pointer',
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: '0.3s',
          }}
        >
          <CardContent>
            <Typography variant="h4" component="div" style={{ fontWeight: 'bold', fontSize: '24px' }}>
              {team.name}
            </Typography>
            <Typography variant="h6" style={{ fontSize: '18px', marginTop: '10px' }}>
              Members: {team.members.length}
            </Typography>
            <Button 
              size="large" 
              style={{ marginTop: '10px' }} 
              variant="contained" 
              color="primary"
              onClick={handleViewDetails} // Navigate on button click
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
