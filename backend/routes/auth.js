const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, full_name, email, password } = req.body;

  try {
    let profile = await Profile.findOne({ email });
    if (profile) return res.status(400).json({ msg: 'User already exists' });

    profile = await Profile.findOne({ username });
    if (profile) return res.status(400).json({ msg: 'Username taken' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    profile = new Profile({
      username,
      full_name,
      email,
      password: hashedPassword
    });

    await profile.save();

    const payload = { id: profile._id, email: profile.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

    res.json({ token, user: { id: profile._id, email: profile.email, username: profile.username, full_name: profile.full_name } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: profile._id, email: profile.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

    res.json({ token, user: { id: profile._id, email: profile.email, username: profile.username, full_name: profile.full_name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.id).select('-password');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
