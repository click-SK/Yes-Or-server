import ProjectModel from '../models/Project.js';
import UserModel from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const createProject = async (req,res) => {
    try {
        const {userId, name, description, request, team, period, target, bonus, category, subcategory} = req.body;

        console.log('WORK');

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.json({message: 'User not found'})
        }
        const newImages = [];
        console.log('req.files',req.files);
        if (req.files && req.files.length > 0) {
            // Process the uploaded files as needed
            req.files.forEach((file) => {
                console.log('file',file);
              const uniqueFileName = uuidv4() + '_' + file.originalname; // замість `/uploadsUser/${file.filename}` тут повинна бути лише `file.originalname`
              newImages.push(`/uploadsProject/${uniqueFileName}`);
              fs.rename(`./uploadsProject/${file.filename}`, `./uploadsProject/${uniqueFileName}`, (err) => {
                if (err) throw err; // не удалось переименовать файл
                console.log("Файл успешно переименован");
              });
            });
            console.log('newImages',newImages);
          }
          
        const project = await ProjectModel.create({
            projectMedia: newImages,
            user,
            name,
            description,
            request,
            team,
            period,
            target,
            bonus,
            category,
            subcategory,
            isVerified: false
        })

        console.log('project',project);

        user.projects.push(project._id);
        await user.save();

        res.json(project);
    } catch(e) {
        console.log(e);
    }
}

export const getAllProject = async (req,res) => {
  try {
    const allProjects = await ProjectModel.find();
    
    res.json(allProjects);
  } catch(error) {
    console.log(error);
  }
}