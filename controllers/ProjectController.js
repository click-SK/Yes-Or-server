import ProjectModel from "../models/Project.js";
import VerifiedProjectModel from "../models/VerifiedProject.js";
import NotVerifiedProjectModel from "../models/NotVerifiedProject.js";
import MainPageProjectModel from "../models/MainPageProject.js";
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

    const newBonus = JSON.parse(bonus);

    console.log("WORK");
    console.log("bonus",JSON.parse(bonus));
    console.log("team",team);

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
      bonus: newBonus,
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
export const updateProject = async (req, res) => {
  try {
    const {
      projectId,
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

    console.log('projectId',projectId);
    console.log('name',name);
    console.log('description',description);
    console.log('request',request);
    console.log('team',team);
    console.log('period',period);
    console.log('target',target);
    console.log('bonus',bonus);
    console.log('category',category);
    console.log('subcategory',subcategory);

    const project = await ProjectModel.findById(projectId);

    const newBonus = JSON.parse(bonus);

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
      project.projectMedia = newImages;
    }

    const newPeriod = JSON.parse(period);

    project.name = name;
    project.description = description;
    project.request = request;
    project.team = team;
    project.period = newPeriod;
    project.target = target;
    project.bonus = newBonus;
    project.category = category;
    project.subcategory = subcategory;
    await project.save();

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
    const project = await ProjectModel.findById(id)
    .populate('comments.user')

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
    // const project = await VerifiedProjectModel.find()
    // .populate("projects")
    // .populate("projects.user")

    const verifiedProjects = await VerifiedProjectModel.find()
    .populate({
      path: "projects",
      populate: {
        path: "user"
      }
    });

    // res.json(project);
    res.json(verifiedProjects);
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

export const getMainPageProjects = async (req, res) => {
  try {
    const project = await MainPageProjectModel.find()
    .populate('project')

    res.json(project)
  } catch (error) {
    console.log(error);
  }
}

export const addProjectToMainPage = async (req, res) => {
  try {
    const { projectId, currentId } = req.body;

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    const mainPageProject = await MainPageProjectModel.create({
      project: project._id,
    })

    res.json(mainPageProject);
  } catch (error) {
    console.log(error);
  }
};

export const removeProjectFromMainPage = async (req, res) => {
  try {
    const { projectId, currentId } = req.body;

    const project = await ProjectModel.findById(projectId);
    const mainPageProject = await MainPageProjectModel.findById(currentId)

    if (!mainPageProject) {
      return res.json({ message: "Project not found" });
    }

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    await MainPageProjectModel.findByIdAndDelete(currentId);

    res.json({message: 'success'})

  } catch (error) {
    console.log(error);
  }
};

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
      text: comment,
      user,
      date
    })

    currentuser.donatesProjects.push({
      project: project._id,
      sum,
      comment,
      date
  })

    project.donatsHistory.forEach((item) => {
      totalSum += item.sum;
    })

    project.amountCollected = totalSum;
    
    await project.save();
    await currentuser.save();

    res.json(project)
  } catch (error) {
    console.log(error);
  }
}

export const addComment = async (req, res) => {
  try {
    const {projectId, userId, comment, name, email} = req.body;

    console.log('projectId',projectId);
    console.log('userId',userId);
    console.log('comment',comment);
    console.log('name',name);
    console.log('email',email);

    if(!projectId) {
      return res.json({message: 'Project not found'})
    }

    // if(!userId) {
    //   return res.json({message: 'User not found'})
    // }
    const project = await ProjectModel.findById(projectId);
    const date = moment().utcOffset(3).format('YYYY-MM-DD HH:mm:ss');

    if(userId) {
      project.comments.push({
        user: userId,
        text: comment,
        date
      }) 
    } else {
      project.comments.push({
        text: comment,
        name,
        email,
        date
      }) 
    }
    
    await project.save();

    res.json(project);
  } catch(error) {
    console.log(error);
  }
}

export const deleteOneComment = async (req, res) => {
  try {
    const {projectId, commentId} = req.body;
    
    if (!projectId || !commentId) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const commentIndex = project.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    project.comments.splice(commentIndex, 1);

    await project.save();

    res.json('success')
  } catch(error) {
    console.log(error);
  }
}