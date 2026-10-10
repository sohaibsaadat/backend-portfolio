import cloudinary from "../config/cloudinary.js";
import Project from "../schemas/projectSchema.js";

export const createProject = async (req,res) => {

try {
    const { title, description, stack, github, live } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Project image is required" });
    }
    if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ success: false, message: "Project image must be an image file" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio/projects",
        filename_override: req.file.originalname,
    });
    const stackItems = Array.isArray(stack) ? stack : (stack || "").split(",").map((item) => item.trim()).filter(Boolean);

    const project = await Project.create({
    title,
    description,
    image: result.secure_url,
    stack: stackItems,
    github,
    live,
})
   res.status(201).json({
            success: true,
            project,
        });
    
} catch (error) {
    console.error("Create project error:", error);
     res.status(500).json({
            success: false,
            message: error.message,
        });
}


}


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stack, github, live } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ success: false, message: "Project image must be an image file" });
      }
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "portfolio/projects",
          filename_override: req.file.originalname,
        }
      );

      project.image = result.secure_url;
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (stack !== undefined) {
      project.stack = Array.isArray(stack) ? stack : stack.split(",").map((item) => item.trim()).filter(Boolean);
    }
    if (github !== undefined) project.github = github;
    if (live !== undefined) project.live = live;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });

  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });

  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      project,
    });

  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};