import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box, Typography, Paper } from '@mui/material';

const KanabanBoard = ({ teamId }) => {
  const [tasks, setTasks] = useState({
    "To Do": [],
    "On Going": [],
    "Done": []
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasksAndMembers = async () => {
      try {
        const [tasksResponse, membersResponse] = await Promise.all([
          axios.get(`/api/tasks/${teamId}`),
          axios.get(`/api/teams/${teamId}/members`)
        ]);

        const organizedTasks = { "To Do": [], "On Going": [], "Done": [] };
        tasksResponse.data.forEach(task => {
          organizedTasks[task.status].push(task);
        });
        setTasks(organizedTasks);
        setTeamMembers(membersResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasksAndMembers();
  }, [teamId]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const movedTask = tasks[source.droppableId][source.index];
    movedTask.status = destination.droppableId;

    try {
      await axios.put(`/api/tasks/${movedTask._id}`, { status: movedTask.status });
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[source.droppableId].splice(source.index, 1);
        updatedTasks[destination.droppableId].splice(destination.index, 0, movedTask);
        return updatedTasks;
      });
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      console.error("Error updating task status:", err);
    }
  };

  const handleAssign = async (taskId, assignedTo) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { assigned_to: assignedTo });
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          updatedTasks[status] = updatedTasks[status].map(task =>
            task._id === taskId ? { ...task, assigned_to: assignedTo } : task
          );
        }
        return updatedTasks;
      });
    } catch (err) {
      setError("Failed to assign task. Please try again.");
      console.error("Error assigning task:", err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" justifyContent="space-around">
        {["To Do", "On Going", "Done"].map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                elevation={3}
                sx={{
                  width: '30%',
                  minHeight: '400px',
                  padding: '16px',
                  backgroundColor: '#f9f9f9',
                  overflow: 'auto',
                }}
              >
                <Typography variant="h6" gutterBottom>{status}</Typography>
                {tasks[status].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        mb={2}
                        p={2}
                        bgcolor="white"
                        boxShadow={1}
                        borderRadius={2}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {task.task_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Assigned to:
                        </Typography>
                        <Select
                          value={task.assigned_to || ""}
                          onChange={(e) => handleAssign(task._id, e.target.value)}
                          displayEmpty
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          <MenuItem value="" disabled>Select team member</MenuItem>
                          {teamMembers.map((member) => (
                            <MenuItem key={member.email} value={member.email}>
                              {member.username}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default KanabanBoard;
