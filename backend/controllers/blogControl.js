const mongoose = require("mongoose");
const Blog = require("../models/BlogModel");
const User = require("../models/Players");

const verifyToken = require("./verifytoken");

// ✅ FIXED getAllBlogs
exports.getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find().populate("user", "name email");
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No Blogs found" });
        }
        res.status(200).json({ blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ FIXED addBlog (Ensured transaction handling)
exports.addBlog = [verifyToken,async (req, res, next) => {
    const { title, description, image, user } = req.body;

    try {
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const blog = new Blog({ title, description, image, user });

        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ blog });
    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).json({ message: "Server Error" });
    }
}];

// ✅ FIXED updateBlog
exports.updateBlog = [verifyToken,async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;

    try {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description }, // Fixed typo (was "desctiption")
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Server Error" });
    }
}];

// ✅ FIXED getById
exports.getById = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("user", "name email");
        if (!blog) {
            return res.status(404).json({ message: "Blog Not Found" });
        }
        res.status(200).json({ blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ FIXED deleteBlog (Ensured user exists before modifying)
exports.deleteBlog =[verifyToken,async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("user");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const user = blog.user;
        if (user) {
            user.blogs.pull(blog);
            await user.save();
        }

        await blog.deleteOne();
        res.status(200).json({ message: "Successfully Deleted the Blog" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Server Error" });
    }
}]; 

// ✅ FIXED getByUserId (Ensured correct population)
exports.getByUserId = async (req, res, next) => {
    try {
        const userBlogs = await User.findById(req.params.id).populate("blogs");
        if (!userBlogs || !userBlogs.blogs.length) {
            return res.status(404).json({ message: "No Blogs Found for this user" });
        }
        res.status(200).json({ blogs: userBlogs.blogs });
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
