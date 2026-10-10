import cloudinary from "../config/cloudinary.js";
import Contact from "../schemas/contactSchema.js";
import Resume from "../schemas/resumeSchema.js";
import Skill from "../schemas/skillSchema.js";
import streamifier from "streamifier";


const uploadFile = (file, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    });
};
export const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: -1 });
        return res.json({ success: true, skills });
    } catch (error) {
        console.error("Get skills error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createSkill = async (req, res) => {
    try {
        if (!req.file || req.file.mimetype !== "image/svg+xml") {
            return res.status(400).json({ success: false, message: "Please upload an SVG file" });
        }
        const result = await uploadFile(req.file, {
            folder: "portfolio/skills",
            resource_type: "raw",
            filename_override: req.file.originalname,
        });
        const skill = await Skill.create({ ...req.body, svg: result.secure_url });
        return res.status(201).json({ success: true, skill });
    } catch (error) {
        console.error("Create skill error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
        if (req.file) {
            if (req.file.mimetype !== "image/svg+xml") {
                return res.status(400).json({ success: false, message: "Please upload an SVG file" });
            }
            const result = await uploadFile(req.file, {
                folder: "portfolio/skills",
                resource_type: "raw",
                filename_override: req.file.originalname,
            });
            skill.svg = result.secure_url;
        }
        if (req.body.title !== undefined) skill.title = req.body.title;
        if (req.body.description !== undefined) skill.description = req.body.description;
        await skill.save();
        return res.json({ success: true, skill });
    } catch (error) {
        console.error("Update skill error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
        return res.json({ success: true, skill });
    } catch (error) {
        console.error("Delete skill error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne() || { email: "", phone: "", socials: [] };
        return res.json({ success: true, contact });
    } catch (error) {
        console.error("Get contact error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const saveContact = async (req, res) => {
    try {
        const { email = "", phone = "", socials = [] } = req.body;
        if (!Array.isArray(socials)) {
            return res.status(400).json({ success: false, message: "Social links must be a list" });
        }
        const contact = await Contact.findOneAndUpdate(
            {},
            { email, phone, socials },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        return res.json({ success: true, contact });
    } catch (error) {
        console.error("Save contact error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne();
        return res.json({ success: true, resume });
    } catch (error) {
        console.error("Get resume error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const saveResume = async (req, res) => {
    try {
        if (!req.file || req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ success: false, message: "Please upload a PDF file" });
        }
        const result = await uploadFile(req.file, {
            folder: "portfolio/resume",
            resource_type: "raw",
            filename_override: req.file.originalname,
        });
        const resume = await Resume.findOneAndUpdate(
            {},
            { url: result.secure_url, filename: req.file.originalname, updatedAt: new Date() },
            { new: true, upsert: true, runValidators: true }
        );
        return res.json({ success: true, resume });
    } catch (error) {
        console.error("Save resume error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
