import mongoose from "mongoose";

const MainPageProjectSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
},{timestamps: true,})

export default mongoose.model('MainPageProject',MainPageProjectSchema)