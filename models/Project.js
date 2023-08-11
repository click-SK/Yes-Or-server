import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectMedia: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: String,
    subcategory: String,
    name: String,
    description: String,
    request: String,
    team: String,
    period: Number,
    target: Number,
    bonus: String,
    isVerified: Boolean,
    amountCollected: Number,
    donatsHistory: [{
        sum: Number,
        user: String
    }]
},{timestamps: true,})

export default mongoose.model('Project',ProjectSchema)