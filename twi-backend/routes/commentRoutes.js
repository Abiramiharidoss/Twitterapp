const express = require("express");
const { Comment, User } = require("../models");
const router = express.Router();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.findAll({ 
      where: { postId: req.params.postId }, 
      include: { model: User, schema: "twitterapp" }, 
      schema: "twitterapp" 
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Add a comment
router.post("/", async (req, res) => {
  try {
    const { text, userId, postId } = req.body;
    const newComment = await Comment.create({ text, userId, postId }, { schema: "twitterapp" });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Error adding comment" });
  }
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    await Comment.destroy({ where: { id: req.params.id }, schema: "twitterapp" });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

module.exports = router;
