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
      passport,
      requisites,
      isVerified,
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
    res.cookie("Y_O_U_refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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

    res.cookie("Y_O_U_refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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
    res.cookie("Y_O_U_refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (e) {
    console.log(e);
  }
};
export const getMe = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await UserService.getMe(userId);
    return res.json(userData);
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
      const newFilename = `/uploadsUser${req.file.originalname}`;
      const previousImage = oldFilename.slice(1);
      const newImage = newFilename.slice(1);

      if(previousImage) {
        try {
          console.log('previousImage',previousImage);
          // Перевіряємо існування файлу перед видаленням
          if (fs.existsSync(previousImage)) {
            console.log('checked old file true');
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

