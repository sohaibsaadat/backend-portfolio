import express from 'express'
import adminAuth from '../middleware/authMiddleware.js'
import { adminLogin } from '../controller/adminController.js'
import { createProject, deleteProject, getAllProjects, updateProject } from '../controller/portfolioController.js'
import { createSkill, deleteSkill, getContact, getResume, getSkills, saveContact, saveResume, updateSkill } from '../controller/contentController.js'
import upload from '../config/multer.js'
const router = express.Router()

router.post("/login",adminLogin)
router.post("/create-project",adminAuth,upload.single("image"),createProject)
router.patch("/update-project/:id",adminAuth,upload.single("image"),updateProject)
router.get("/get-all-project",getAllProjects)
router.delete("/delete-project/:id",adminAuth,deleteProject)
router.get("/get-all-skills",getSkills)
router.post("/create-skill",adminAuth,upload.single("svg"),createSkill)
router.patch("/update-skill/:id",adminAuth,upload.single("svg"),updateSkill)
router.delete("/delete-skill/:id",adminAuth,deleteSkill)
router.get("/get-contact",getContact)
router.put("/contact",adminAuth,saveContact)
router.get("/get-resume",getResume)
router.put("/resume",adminAuth,upload.single("resume"),saveResume)
export default router