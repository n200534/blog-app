const User = require("../models/Players");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET='your secret'
// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};

exports.getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to check for existing user" });
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10); // Added salt rounds
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create user" });
  }

  return res.status(201).json({ user });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to check for existing user" });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "Please Sign Up" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Password is not correct" });
  }

  // Generate and return a JWT
  const token = generateToken(existingUser._id);
  return res.status(200).json({ message: "Login Successful", token, user: existingUser });
};