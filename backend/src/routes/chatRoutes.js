import express from "express";
import Chat from "../models/Chat.js";
import { getChatMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

// Get all chats for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const chats = await Chat.find({
      $or: [{ posterId: userId }, { acceptedUserId: userId }]
    }).populate("posterId acceptedUserId", "name email");

    res.status(200).json(chats);
  } catch (err) {
    console.error("fetch user chats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get chat messages for specific job (between poster & accepted user)
router.get("/:posterId/:jobId/:acceptedUserId", getChatMessages);

// Send new message
router.post("/", sendMessage);

export default router;
