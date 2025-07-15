const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Check if user already exists
  let user = await User.findOne({ email: 'testuser@example.com' });
  const hashedPassword = await bcrypt.hash('testpass123', 10);

  if (!user) {
    user = await User.create({
      name: 'Test User ',
      email: 'testuser@example.com',
      password: hashedPassword, 
    });
    console.log('User created');
  } else {
    console.log('User already exists');
  }

  // Check if project already exists
  let project = await Project.findOne({ title: 'Sample Project' });

  if (!project) {
    project = await Project.create({
      title: 'Sample Project',
      description: 'This is a sample project used for testing.',
      owner: user._id,
    });
    console.log('Project created');
  } else {
    console.log('Project already exists');
  }

  // Check if tasks already exist
  const existingTasks = await Task.find({ project: project._id });
  if (existingTasks.length === 0) {
    await Task.insertMany([
      {
        title: 'Setup environment',
        description: 'Install dependencies and configure the environment.',
        status: 'todo',
        project: project._id,
        assignedTo: user._id,
      },
      {
        title: 'Implement authentication',
        description: 'Add login and register functionality.',
        status: 'in progress',
        project: project._id,
        assignedTo: user._id,
      },
      {
        title: 'Deploy application',
        description: 'Deploy the app to the production environment.',
        status: 'done',
        project: project._id,
        assignedTo: user._id,
      },
    ]);
    console.log('Tasks added');
  } else {
    console.log('Tasks already exist');
  }

  console.log('Seeding complete');
  process.exit();
}

seed();
