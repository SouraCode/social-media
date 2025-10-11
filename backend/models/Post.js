const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  image_url: { type: String },
  caption: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
