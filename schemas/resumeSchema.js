import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    url: { type: String, required: true },
    filename: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
