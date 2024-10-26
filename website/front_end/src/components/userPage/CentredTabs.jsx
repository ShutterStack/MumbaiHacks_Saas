// CentredTabs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import './CentredTabs.css'; // Import the CSS file for styling
import Docs from '../../documentation/Docs';
import White from '../../whiteboard/White';
import Kanaban from '../../components/userPage/KanabanBoard';

const CentredTabs = () => {
  const [activeTab, setActiveTab] = useState('Tasks'); // State to track the active tab
  const [data, setData] = useState({
    tasks: [],
    documentation: [],
    whiteboard: [],
  }); // State to hold general data

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const response = await axios.get('/api/general-data'); // Fetch general data from the backend
        setData(response.data); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching general data:', error);
      }
    };

    fetchGeneralData();
  }, []); // Fetch data when the component mounts

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab on click
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'Tasks' ? 'active' : ''}`}
          onClick={() => handleTabClick('Tasks')}
        >
          Tasks
        </div>
        <div
          className={`tab ${activeTab === 'Whiteboard' ? 'active' : ''}`}
          onClick={() => handleTabClick('Whiteboard')}
        >
          Whiteboard
        </div>
        <div
          className={`tab ${activeTab === 'Documentation' ? 'active' : ''}`}
          onClick={() => handleTabClick('Documentation')}
        >
          Documentation
        </div>
      </div>
      <div className="content">
        {activeTab === 'Tasks' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Tasks</h2>
            {data.tasks.length > 0 ? (
              data.tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold' }}>{task.title}</h4>
                  <p style={{ fontSize: '18px' }}>{task.description}</p>
                  {task.dueDate && (
                    <p style={{ fontSize: '16px', color: '#555' }}>
                      Due Date: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <Kanaban />
            )}
          </div>
        )}
        {activeTab === 'Whiteboard' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Whiteboard</h2>
            {data.whiteboard.length > 0 ? (
              data.whiteboard.map((item, index) => (
                <div key={index} className="whiteboard-item">
                  <p style={{ fontSize: '18px' }}>{item.content}</p>
                </div>
              ))
            ) : (
              <White />
            )}
          </div>
        )}
        {activeTab === 'Documentation' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Documentation</h2>
            {data.documentation.length > 0 ? (
              data.documentation.map((doc, index) => (
                <div key={index} className="documentation-item">
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold' }}>{doc.title}</h4>
                  <p style={{ fontSize: '18px' }}>{doc.content}</p>
                </div>
              ))
            ) : (
              <Docs />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CentredTabs;
