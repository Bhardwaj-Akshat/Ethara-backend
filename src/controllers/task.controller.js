import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

// ✅ Create Task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    // ✅ check user belongs to project
    if (
      assignedTo &&
      !project.members.includes(assignedTo) &&
      project.createdBy.toString() !== assignedTo
    ) {
      return res.status(400).json({ msg: "User not in project" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get Tasks (role-based)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Update Status (assigned user or admin)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only assigned user or admin
    if (
      task.assignedTo?.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Delete Task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    let filter = {};

    // 👤 Member → only assigned tasks
    if (req.user.role !== "Admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter);

    const total = tasks.length;

    const completed = tasks.filter(
      (t) => t.status === "Completed"
    ).length;

    const pending = tasks.filter(
      (t) => t.status !== "Completed"
    ).length;

    const overdue = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "Completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};