import express from "express";
import DiscussionPost from "../models/DiscussionPost.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/discussions
 * Supports: ?page=1&limit=10&tag=python
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;

    const filter = {};

    // Correct tag filter
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const discussions = await DiscussionPost.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const total = await DiscussionPost.countDocuments(filter);

    res.json({
      discussions,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("Error in GET discussions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST create a discussion
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newPost = await DiscussionPost.create({
      title: title.trim(),
      content: content.trim(),
      tags,
      author: req.user._id,
    });

    await newPost.populate("author", "name email");
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating discussion:", err);
    res.status(500).json({ error: "Failed to create discussion." });
  }
});

/**
 * GET a single discussion (auto increment views)
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await DiscussionPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!post) return res.status(404).json({ message: "Discussion not found." });

    res.json(post);
  } catch (err) {
    console.error("Error fetching discussion:", err);
    res.status(500).json({ error: "Failed to fetch discussion." });
  }
});

/**
 * POST comment
 */
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim())
      return res.status(400).json({ message: "Comment text is required." });

    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Discussion not found." });

    const newComment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];
    await DiscussionPost.populate(addedComment, {
      path: "user",
      select: "name email",
    });

    res.status(201).json({ message: "Comment added", comment: addedComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

export default router;