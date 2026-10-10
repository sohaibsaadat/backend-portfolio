import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    socials: {
        type: [{ platform: { type: String, required: true }, url: { type: String, required: true } }],
        default: [],
    },
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
