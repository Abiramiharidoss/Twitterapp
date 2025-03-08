const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware for protecting routes
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

router.post("/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body; // Get userId from the request body
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const filename = `/uploads/${req.file.filename}`;

    // Update database with new profile picture filename
    await pool.query(
      'UPDATE twitterapp."Users" SET "profilePic" = $1 WHERE id = $2',
      [filename, userId] // Use userId from req.body
    );

    res.json({ message: "Profile picture updated", profilePic: filename });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// **User Registration Route**
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user exists
    const userExists = await pool.query(
      'SELECT * FROM twitterapp."Users" WHERE email = $1',
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO twitterapp."Users" (name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// **User Login Route**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const userQuery = await pool.query(
      'SELECT * FROM twitterapp."Users" WHERE email = $1',
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Remove password before sending response
    delete user.password;

    res.json({
      message: "Login successful",
      token,
      user, // Send user details
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Protected Route Example**
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email FROM Users WHERE id = $1",
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
