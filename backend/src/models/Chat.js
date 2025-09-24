// models/Chat.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: String,
  text: String,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  posterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  acceptedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
