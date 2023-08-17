import ProjectModel from "../models/Project.js";
import VerifiedProjectModel from "../models/VerifiedProject.js";
import NotVerifiedProjectModel from "../models/NotVerifiedProject.js";
import UserModel from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import moment from 'moment';

export const createProject = async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      request,
      team,
      period,
      target,
      bonus,
      category,
      subcategory,
    } = req.body;

    console.log("WORK");

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ message: "User not found" });
    }
    const newImages = [];
    console.log("req.files", req.files);
    if (req.files && req.files.length > 0) {
      // Process the uploaded files as needed
      req.files.forEach((file) => {
        console.log("file", file);
        const uniqueFileName = uuidv4() + "_" + file.originalname; // замість `/uploadsUser/${file.filename}` тут повинна бути лише `file.originalname`
        newImages.push(`/uploadsProject/${uniqueFileName}`);
        fs.rename(
          `./uploadsProject/${file.filename}`,
          `./uploadsProject/${uniqueFileName}`,
          (err) => {
            if (err) throw err; // не удалось переименовать файл
            console.log("Файл успешно переименован");
          }
        );
      });
      console.log("newImages", newImages);
    }

    const newPeriod = JSON.parse(period);

    console.log('newPeriod',newPeriod);
    const project = await ProjectModel.create({
      projectMedia: newImages,
      user,
      name,
      description,
      request,
      team,
      period: newPeriod,
      target,
      amountCollected: 0,
      bonus,
      category,
      subcategory,
      isVerified: false,
    });

    console.log("project", project);

    user.projects.push(project._id);
    await user.save();

    await NotVerifiedProjectModel.create({
      projects: project._id,
    });

    res.json(project);
  } catch (e) {
    console.log(e);
  }
};

export const getAllProject = async (req, res) => {
  try {
    const allProjects = await ProjectModel.find();

    res.json(allProjects);
  } catch (error) {
    console.log(error);
  }
};

export const getOneProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id);

    res.json(project);
  } catch (error) {
    console.log(error);
  }
};

export const savedProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    user.savedProjects.push(project._id);
    await user.save();

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const removeSavedProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    user.savedProjects.pull(project._id);
    await user.save();

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const addVerifiedProject = async (req, res) => {
  try {
    const { projectId, currentId } = req.body;

    const project = await ProjectModel.findById(projectId);
    const notVerified = await NotVerifiedProjectModel.findById(currentId)

    if (!notVerified) {
      return res.json({ message: "Verified project not found" });
    }

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    project.period.startDate = moment().utcOffset(3);
    project.isVerified = true;
    await project.save();
    
    const verifiedProject = await VerifiedProjectModel.create({
      projects: notVerified.projects,
    });

    await NotVerifiedProjectModel.findByIdAndDelete(currentId);

    res.json(verifiedProject);
  } catch (error) {
    console.log(error);
  }
};
export const removeVerifiedProject = async (req, res) => {
  try {
    const { projectId, currentId } = req.body;

    const project = await ProjectModel.findById(projectId);
    const notVerified = await VerifiedProjectModel.findById(currentId)

    if (!notVerified) {
      return res.json({ message: "Verified project not found" });
    }

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    project.isVerified = false;
    await project.save();
    
    const notVerifiedProject = await NotVerifiedProjectModel.create({
      projects: notVerified.projects,
    });

    await VerifiedProjectModel.findByIdAndDelete(currentId);

    res.json(notVerifiedProject);
  } catch (error) {
    console.log(error);
  }
};

export const getAllVerifiedProject = async (req, res) => {
  try {
    const project = await VerifiedProjectModel.find().populate("projects");

    res.json(project);
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotVerifiedProject = async (req, res) => {
  try {
    const project = await NotVerifiedProjectModel.find().populate('projects');

    res.json(project)
  } catch (error) {
    console.log(error);
  }
}
export const donatsToProject = async (req, res) => {
  try {
    const {projectId, sum, user, comment, userId} = req.body;
    const date = moment().utcOffset(3).format('YYYY-MM-DD HH:mm:ss');
    const project = await ProjectModel.findById(projectId);
    const currentuser = await UserModel.findById(userId);

    console.log('projectId',projectId);
    console.log('sum',sum);
    console.log('user',user);
    console.log('comment',comment);
    console.log('userId',userId);

    let totalSum = 0;

    project.donatsHistory.push({
      sum,
      user,
      date
    })

    currentuser.donatesProjects.push({
      project: project._id,
      sum,
      comment
  })

    project.donatsHistory.forEach((item) => {
      totalSum += item.sum;
    })

    project.amountCollected = totalSum;

    if(comment) {
      project.comments.push({
        user: userId,
        text: comment
      })
    }

    await project.save();
    await currentuser.save();

    res.json(project)
  } catch (error) {
    console.log(error);
  }
}

