const express = require("express");
const multer = require("multer");
const path = require("path");
const { Post, User, Like, Comment } = require("../models");

const router = express.Router();

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User }, { model: Like }, { model: Comment }],
      schema: "twitterapp",
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Create a new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res
        .status(400)
        .json({ error: "Title, description, and userId are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await Post.create(
      { title, description, image, userId },
      { schema: "twitterapp" }
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // Get userId from query params

    const post = await Post.findOne({ where: { id }, schema: "twitterapp" });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== Number(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
});

module.exports = router;
