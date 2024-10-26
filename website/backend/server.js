const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please enter a valid email address'] },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['employee', 'manager'], required: true },
  date: { type: Date, default: Date.now }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  members: { type: [String], required: true }, // Array of member emails
  date: { type: Date, default: Date.now },
});

// Create Team model
const Team = mongoose.model('Team', teamSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  date: { type: Date, default: Date.now }
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials or role' });
    }
    res.json({ message: 'Login successful!', user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Team creation route
app.post('/api/teams', async (req, res) => {
  const { teamName, selectedMembers } = req.body;

  try {
    const newTeam = new Team({ name: teamName, members: selectedMembers });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Failed to create team:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).send('Server error');
  }
});

// Get team by ID
app.get('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    console.error('Failed to fetch team:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('username email');
    res.json(employees);
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// Task Routes

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { task_name, assigned_to, team_id } = req.body;

  try {
    const newTask = new Task({ task_name, assigned_to, team_id });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Get all tasks for a team
app.get('/api/tasks/team/:teamId', async (req, res) => {
  try {
    const tasks = await Task.find({ team_id: req.params.teamId }).populate('assigned_to', 'username');
    res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Update task status
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = req.body.status || task.status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Assign task to a team member
app.patch('/api/tasks/assign/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.assigned_to = req.body.assigned_to;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Failed to assign task:', error);
    res.status(500).json({ message: 'Failed to assign task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});
app.post('/generate', async (req, res) => {
  const { text, action } = req.body; // 'action' specifies if we are generating or summarizing
  const geminiApiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.gemini.com/v1/generate', // Update with actual Gemini endpoint
      {
        text,
        action,
      },
      {
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error interacting with Gemini:', error);
    res.status(500).json({ message: 'Error processing text' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
