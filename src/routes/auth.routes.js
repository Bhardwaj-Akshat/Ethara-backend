import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // if folder = middlewares// ✅ correct import

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ✅ FIX: protect must be used here
router.get("/getMe", protect, getMe);

router.get("/protected", protect, (req, res) => {
  res.json({ msg: "This is a protected route", user: req.user });
});

export default router;