import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/project.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// 🔹 CREATE (Admin)
router.post("/", protect, isAdmin, createProject);

// 🔹 READ (All logged-in users)
router.get("/", protect, getProjects);

// 🔹 UPDATE (Admin)
router.put("/:id", protect, isAdmin, updateProject);

// 🔹 DELETE (Admin)
router.delete("/:id", protect, isAdmin, deleteProject);

// 🔹 MEMBER MANAGEMENT
router.put("/:id/add-member", protect, isAdmin, addMember);
router.put("/:id/remove-member", protect, isAdmin, removeMember);

export default router;