import mongoose from "mongoose";

const ArchivalProjectSchema = new mongoose.Schema({
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
},{timestamps: true,})

export default mongoose.model('ArchivalProject',ArchivalProjectSchema)