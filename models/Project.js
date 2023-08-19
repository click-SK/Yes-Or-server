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
    team: [String],
    period: {
        startDate: String,
        countDays: Number
    },
    target: Number,
    bonus: [{
        title: String,
        amount: String
    }],
    isVerified: Boolean,
    amountCollected: Number,
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: String
    }],
    donatsHistory: [{
        sum: Number,
        user: String,
        date:String
    }]
},{timestamps: true,})

export default mongoose.model('Project',ProjectSchema)