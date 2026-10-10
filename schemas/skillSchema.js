import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        svg: { type: String, required: true },
    },
    { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;
