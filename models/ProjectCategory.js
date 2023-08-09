import mongoose from "mongoose";

const ProjectCategorySchema = new mongoose.Schema({
    category: String,
    subcategory: [
        {
            name: String
        }
    ]
},{timestamps: true,})

export default mongoose.model('ProjectCategory',ProjectCategorySchema)