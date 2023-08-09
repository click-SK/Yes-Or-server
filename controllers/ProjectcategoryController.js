import ProjectCategoryModel from '../models/ProjectCategory.js'

export const createCategory = async (req,res) => {
    try {
        const {category, subcategory} = req.body;

        const chekedCategory = await ProjectCategoryModel.findOne({category});

        if(chekedCategory) {
            return res.json({message: 'Category exist'})
        }

        const newCategory = await ProjectCategoryModel.create({
            category,
            subcategory
        })

        res.json(newCategory)
    } catch(e) {
        console.log(e);
    }
}
export const getAllCategory = async (req,res) => {
    try {
        const allCategory = await ProjectCategoryModel.find();
        res.json(allCategory);
    } catch(e) {
        console.log(e);
    }
}