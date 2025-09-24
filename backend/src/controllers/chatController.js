// controllers/chatController.js
import Chat from "../models/Chat.js";

// Get chat messages (filter by jobId at message level)
export const getChatMessages = async (req, res) => {
  const { posterId, jobId, acceptedUserId } = req.params;

  try {
    // ✅ Find chat between these 2 users (ignore jobId at chat level)
    let chat = await Chat.findOne({
      $or: [
        { posterId, acceptedUserId },
        { posterId: acceptedUserId, acceptedUserId: posterId }
      ]
    });

    if (!chat) {
      // Create chat if it doesn’t exist
      chat = new Chat({ posterId, acceptedUserId, messages: [] });
      await chat.save();
    }

    // ✅ Filter only messages related to this job
    const filteredMessages = chat.messages.filter(
      (msg) => msg.jobId?.toString() === jobId
    );

    res.status(200).json(filteredMessages);
  } catch (err) {
    console.error("getChatMessages error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  const { posterId, acceptedUserId, jobId, senderId, text } = req.body;

  if (!posterId || !acceptedUserId || !jobId || !senderId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let chat = await Chat.findOne({
      $or: [
        { posterId, acceptedUserId },
        { posterId: acceptedUserId, acceptedUserId: posterId }
      ]
    });

    if (!chat) {
      // ✅ Ensure IDs are set
      chat = new Chat({ posterId, acceptedUserId, messages: [] });
    }

    chat.messages.push({ senderId, text, jobId });
    await chat.save();

    // Return only messages for this job
    const jobMessages = chat.messages.filter(
      (msg) => msg.jobId.toString() === jobId
    );

    res.status(200).json(jobMessages);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: err.message });
  }
};

