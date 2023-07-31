import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email: String,
    isAdmin: Boolean,
    password: String,
},{timestamps: true,})

export default mongoose.model('Admin',AdminSchema)