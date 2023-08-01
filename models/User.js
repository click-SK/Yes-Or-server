import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userImage: String,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    socialNetwork: String,
    password: String,
    passport: String,
    requisites: String,
    isVerified: Boolean,
    isActivated: Boolean,
},{timestamps: true,})

export default mongoose.model('User',UserSchema)