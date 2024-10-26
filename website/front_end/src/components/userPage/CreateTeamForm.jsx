import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        console.log('Fetched employees:', response.data); // Add this line
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);
  

  const handleMemberSelect = (email) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(email)
        ? prevMembers.filter((member) => member !== email)
        : [...prevMembers, email]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const teamData = {
      teamName,
      selectedMembers,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/teams', teamData);
      console.log('Team created:', response.data);
      // Reset form or perform any additional actions
      setTeamName('');
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Team</h2>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <h3>Select Members</h3>
      {employees.map((employee) => (
        <div key={employee.email}>
          <label>
            <input
              type="checkbox"
              checked={selectedMembers.includes(employee.email)}
              onChange={() => handleMemberSelect(employee.email)}
            />
            {employee.username} ({employee.email})
          </label>
        </div>
      ))}
      <button type="submit">Create Team</button>
    </form>
  );
};

export default CreateTeamForm;
