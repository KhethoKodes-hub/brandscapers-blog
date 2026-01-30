// server/models/Post.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, required: true }
}, { _id: false });

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }]
}, { _id: true });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  content: { type: String, required: true },
  excerpt: String,
  tags: [String],
  published: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  author: {
    id: { type: String }, // Firebase UID
    name: String
  },
  coverImage: String,
  media: [mediaSchema],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // array of Firebase UIDs
  comments: [commentSchema],
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
