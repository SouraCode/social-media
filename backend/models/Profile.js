const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  avatar_url: { type: String },
  bio: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true }, // For auth
  password: { type: String, required: true } // Hashed
});

module.exports = mongoose.model('Profile', profileSchema);
