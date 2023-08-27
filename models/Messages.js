import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    history: [{
        user: String,
        message: String,
        date: String
    }]
},{timestamps: true,})

export default mongoose.model('Messages',MessagesSchema)