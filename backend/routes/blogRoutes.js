const express = require("express");
const { 
  getAllBlogs, 
  addBlog, 
  updateBlog, 
  getById, 
  deleteBlog, 
  getByUserId 
} = require("../controllers/blogControl");
const verifyToken = require("../controllers/verifytoken"); // Import the token verification middleware

const Blogrouter = express.Router();

// Public routes (no token required)
Blogrouter.get("/", getAllBlogs); // Get all blogs
Blogrouter.get("/:id", getById); // Get blog by ID

// Protected routes (token required)
Blogrouter.post("/add", verifyToken, addBlog); // Add a new blog
Blogrouter.put("/update/:id", verifyToken, updateBlog); // Update a blog
Blogrouter.delete("/:id", verifyToken, deleteBlog); // Delete a blog
Blogrouter.get("/user/:id", verifyToken, getByUserId); // Get blogs by user ID

module.exports = Blogrouter;