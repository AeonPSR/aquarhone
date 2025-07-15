const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function addTasks() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: 'testuser@example.com' });
  if (!user) return console.log('User not found');

  const project = await Project.findOne({ owner: user._id });
  if (!project) return console.log('Project not found');

  const tasks = [
    { title: 'Task 1', description: 'Desc1', status: 'todo' },
    { title: 'Fix backend bug', description: 'debug debug debug debug', status: 'in progress' },
    { title: 'Deploy frontend', description: 'aaaaaaaaaaa', status: 'done' },
  ];

  for (const taskData of tasks) {
    const task = new Task({
      ...taskData,
      project: project._id,
      assignedTo: user._id,
    });
    await task.save();
    console.log(`Added task: ${task.title}`);
  }

  process.exit();
}

addTasks();
