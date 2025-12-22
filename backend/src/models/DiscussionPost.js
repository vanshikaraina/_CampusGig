//DiscussionPost.js
// backend/src/models/DiscussionPost.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const discussionPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String], // e.g., ['advice', 'frontend', 'Node.js']
    comments: [commentSchema],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DiscussionPost = mongoose.model(
  "DiscussionPost",
  discussionPostSchema
);
export default DiscussionPost;