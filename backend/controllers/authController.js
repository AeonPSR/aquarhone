const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
	try {
	  const { email, password } = req.body;
  
	  const user = await User.findOne({ email });
	  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
	  const match = await bcrypt.compare(password, user.password);
	  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  
	  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '2h',
	  });
    res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  };
  

module.exports = { registerUser, loginUser };
