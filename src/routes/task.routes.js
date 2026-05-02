import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { getDashboardStats } from "../controllers/task.controller.js";
const router = express.Router();


router.get("/stats/dashboard", protect, getDashboardStats);


// ✅ Admin only
router.post("/", protect, isAdmin, createTask);

// ✅ All users
router.get("/", protect, getTasks);

// ✅ Update status
router.put("/:id/status", protect, updateTaskStatus);

// ✅ Delete
router.delete("/:id", protect, isAdmin, deleteTask);

export default router;