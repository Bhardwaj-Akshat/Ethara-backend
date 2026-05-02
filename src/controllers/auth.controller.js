import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let { role } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔥 ROLE FIX + SECURITY
    if (role === "User") role = "Member";
    if (!["Admin", "Member"].includes(role)) {
      role = "Member";
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    // generate JWT cookie
    generateToken(res, user._id);

    // remove password from response
    const { password: _, ...userData } = user.toObject();

    res.status(201).json(userData);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // generate token
    generateToken(res, user._id);

    // remove password
    const { password: _, ...userData } = user.toObject();

    res.json(userData);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};

// ✅ GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ msg: "Failed to fetch user" });
  }
};