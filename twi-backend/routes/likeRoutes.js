const express = require("express");
const { Like } = require("../models");
const router = express.Router();

// Like a post
router.post("/", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res
        .status(400)
        .json({ error: "User ID and Post ID are required" });
    }

    const existingLike = await Like.findOne({
      where: { userId, postId },
      schema: "twitterapp",
    });

    if (existingLike) {
      return res.status(400).json({ error: "Already liked this post" });
    }

    await Like.create({ userId, postId }, { schema: "twitterapp" });

    const likeCount = await Like.count({
      where: { postId },
      schema: "twitterapp",
    });

    res.status(201).json({ message: "Post liked", likeCount });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: error.message || "Error liking post" });
  }
});

// Unlike a post
router.delete("/", async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const deleted = await Like.destroy({
      where: { userId, postId },
      schema: "twitterapp",
    });

    if (!deleted) {
      return res.status(400).json({ error: "Like not found" });
    }

    const likeCount = await Like.count({
      where: { postId },
      schema: "twitterapp",
    });

    res.json({ message: "Post unliked", likeCount });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: error.message || "Error unliking post" });
  }
});

module.exports = router;
