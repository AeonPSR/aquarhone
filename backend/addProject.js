const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');

async function addProject() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: 'testuser@example.com' });

  if (!user) {
    console.log('User not found!');
    return;
  }

  const project = new Project({
    title: 'Linked Project',
    description: 'A project linked to testuser@example.com',
    owner: user._id,
    collaborators: [],
  });

  await project.save();
  console.log('Project created and linked to test user');

  process.exit();
}

addProject();
