import Project from "../models/project.model.js";

// ✅ Create Project (Admin)
export const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get Projects (Role-based)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Add Member
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (!project.members.includes(userId)) {
      project.members.push(userId);
    }

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Remove Member
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    project.members = project.members.filter(
      (id) => id.toString() !== userId
    );

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
// ✅ Update Project
export const updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔐 Optional: only creator can update
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed to update this project" });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// ✅ Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔐 Optional: only creator can delete
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed to delete this project" });
    }

    await project.deleteOne();

    res.json({ msg: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
