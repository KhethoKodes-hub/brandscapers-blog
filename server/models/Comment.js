// server/models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // display name or email
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who liked
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // for replies
  deleted: { type: Boolean, default: false } // keep your deleted flag
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
