import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};