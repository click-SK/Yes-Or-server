import * as UserService from "../services/UserService.js";
import bcrypt from 'bcrypt';
import UserModel from "../models/User.js";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
export const register = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      socialNetwork,
      phone,
      isVerified,
      passport,
      requisites
    } = req.body;

    const userData = await UserService.registration(
      email,
      firstName,
      lastName,
      password,
      socialNetwork,
      phone,
      passport,
      requisites,
      isVerified
    );

    if (userData.error) {
    }
    await res.cookie('Y_O_U_refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
  });
    return res.json(userData);
  } catch (error) {
    console.error("Помилка реєстрації користувача:", error);
    res.status(500).json({ message: "Не вдалося зареєструвати користувача" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await UserService.login(email, password);
    if (userData.error) {
      return res.json({ message: userData.error });
    }

    await res.cookie('Y_O_U_refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
  });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res) => {
  try {
    const { Y_O_U_refreshToken } = req.cookies;
    const token = await UserService.logout(Y_O_U_refreshToken);
    res.clearCookie("Y_O_U_refreshToken");
    return res.json(token);
  } catch (e) {
    console.log(e);
  }
};

export const refresh = async (req, res) => {
  try {
    const { Y_O_U_refreshToken } = req.cookies;
    const userData = await UserService.refresh(Y_O_U_refreshToken);
    if (userData.error) {
      return res.status(503).json({ message: userData.error });
    }
    await res.cookie('Y_O_U_refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
  });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};
export const getMe = async (req, res) => {
  try {
    const userId = req.params.id;
    // const userData = await UserModel.findOne({_id: userId})
    // .populate('projects')
    // .populate('savedProjects')
    // .populate('donatesProjects.project')
    const userData = await UserModel.findOne({_id: userId})
    .populate('projects')
    .populate('savedProjects')
    .populate({
      path: 'donatesProjects.project',
      model: 'Project'
    });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const userData = await UserModel.find()
    .populate('projects')
    .populate('savedProjects')
    .populate('donatesProjects.project');
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};
export const blockedUser = async (req, res) => {
  try {
    const {id, isActivated} = req.body;
    console.log('id',id);
    console.log('isActivated',isActivated);
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    user.isActivated = isActivated;
    user.save();
    return res.json(user);
  } catch (e) {
    console.log(e);
  }
};
export const verifiedUser = async (req, res) => {
  try {
    const {id, isVerified} = req.body;
    console.log('id',id);
    console.log('isVerified',isVerified);
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    user.isVerified = isVerified;
    user.save();
    return res.json(user);
  } catch (e) {
    console.log(e);
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Перевірка старого паролю
    const isOldPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        message: 'Invalid current password',
      });
    }

    // Якщо старий пароль співпадає, генеруємо новий хеш для нового паролю
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    await user.save();

    res.json({
      message: 'Password updated successfully',
    });
  } catch (e) {
    console.log(e);
  }
};

export const updateUserData = async (req, res) => {
  try {
    const {id, firstName, lastName, phone, socialNetwork, passport, requisites, email} = req.body;
    const user = await UserModel.findById(id);

    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if(req.file && req.file.originalname) {
      const uniqueFileName = uuidv4() + '_' + req.file.originalname;
      const oldFilename = user.userImage;
      const previousImage = oldFilename && oldFilename.slice(1);

      if(previousImage) {
        try {
          // Перевіряємо існування файлу перед видаленням
          if (fs.existsSync(previousImage)) {
            fs.promises.unlink(previousImage);
          }
        } catch (error) {
          console.log('Помилка видалення попереднього зображення:', error);
        }
      }

      user.userImage = `/uploadsUser/${uniqueFileName}`;
      fs.rename(`./uploadsUser/${req.file.originalname}`, `./uploadsUser/${uniqueFileName}`, (err) => {
        if (err) throw err; // не удалось переименовать файл
        console.log("Файл успешно переименован");
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.socialNetwork = socialNetwork;
    user.passport = passport;
    user.requisites = requisites;
    user.email = email;

    await user.save();

    res.json(user)

    
  } catch (e) {
    console.log(e);
  }
};

export const uploadUserDocuments = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id);

    console.log('req.files', req.files);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.files && req.files.length > 0) {
      user.userDocuments.forEach((item) => {
        const previousImage = item.slice(1);
        console.log('previousImage', previousImage);
        if (item) {
          try {
            // Перевіряємо існування файлу перед видаленням
            if (fs.existsSync(previousImage)) {
              console.log('Файл існує');
              fs.promises.unlink(previousImage);
            }
          } catch (error) {
            console.log('Помилка видалення попереднього зображення:', error);
          }
        }
      });

      // Process the uploaded files as needed
      const newImages = [];
      req.files.forEach((file) => {
        const uniqueFileName = uuidv4() + '_' + file.originalname; // замість `/uploadsUser/${file.filename}` тут повинна бути лише `file.originalname`
        newImages.push(`/uploadsUser/${uniqueFileName}`);
        fs.rename(`./uploadsUser/${file.filename}`, `./uploadsUser/${uniqueFileName}`, (err) => {
          if (err) throw err; // не удалось переименовать файл
          console.log("Файл успешно переименован");
        });
      });
      console.log('newImages', newImages);
      user.userDocuments = newImages;
    }

    await user.save();

    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id).populate('projects');
    res.json(user.projects);
  } catch (error) {
    console.log(error);
  }
}