const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  follower_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  following_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  created_at: { type: Date, default: Date.now }
});

// Unique compound index
followerSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

// Prevent self-follow
followerSchema.pre('save', function(next) {
  if (this.follower_id.equals(this.following_id)) {
    return next(new Error('Cannot follow yourself'));
  }
  next();
});

module.exports = mongoose.model('Follower', followerSchema);
