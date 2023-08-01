import AdminModel from "../models/Admin.js";
import bcrypt from "bcrypt";
import * as TokenService from "./AdminTokenService.js";
import * as UserDto from "../dots/UserDto.js";

export const registration = async (email, password, isAdmin) => {
  try {
    const canditate = await AdminModel.findOne({ email });

    if (canditate) {
      return { error: "A user with this email already exists" };
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await AdminModel.create({
      email,
      isAdmin,
      password: hash
    });

    const userDto = UserDto.createUserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    const { accessToken, refreshToken } = tokens;
    await TokenService.saveTokens(userDto.id, refreshToken);

    return { refreshToken, accessToken, user };
  } catch (e) {
    console.log(e);
  }
};

export const login = async (email, password) => {
  try {
    const user = await AdminModel.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    const isvalidPassword = await bcrypt.compare(password, user.password);

    if (!isvalidPassword) {
      return { error: "Password not found" };
    }

    const userDto = UserDto.createUserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    const { accessToken, refreshToken } = tokens;
    await TokenService.saveTokens(userDto.id, refreshToken);
    return { refreshToken, accessToken, user };
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (refreshToken) => {
  try {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  } catch (e) {
    console.log(e);
  }
};

export const refresh = async (token) => {
  try {
    if (!token) {
      return { error: "Token Error" };
    }

    console.log('token',token);

    const tokenFromDb = await TokenService.findToken(token);
    const userData = await TokenService.validateRefreshToken(token);
    console.log('tokenFromDb',tokenFromDb);
    console.log('userData',userData);

    if (!userData || !tokenFromDb) {
      return { error: "Validation error" };
    }

    const user = await AdminModel.findById(userData.id);
    const userDto = UserDto.createUserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    const { accessToken, refreshToken } = tokens;
    await TokenService.saveTokens(userDto.id, refreshToken);
    return { refreshToken, accessToken, user };
  } catch (e) {
    console.log(e);
  }
};
