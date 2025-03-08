const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models"); // Import sequelize from models

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Use Routes
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate(); // Ensure database connection
    console.log("Database connected.");
    await sequelize.sync({ alter: true }); // Sync models
    console.log("Models synced.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
  console.log(`Server is running on port ${PORT}`);
});
