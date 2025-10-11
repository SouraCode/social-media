const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  created_at: { type: Date, default: Date.now }
});

// Unique compound index
likeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
