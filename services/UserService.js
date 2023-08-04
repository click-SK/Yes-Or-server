import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import * as TokenService from "./UserTokenService.js";
import * as UserDto from "../dots/UserDto.js";

export const registration = async (email, firstName, lastName, password, socialNetwork, phone, passport, requisites, isVerified) => {
  try {
    const canditate = await UserModel.findOne({ email });

    if (canditate) {
      return { message: "Email already exists" };
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      email,
      password: hash,
      firstName,
      lastName,
      phone,
      socialNetwork,
      passport,
      requisites,
      isVerified: false,
      userImage: '',
      isActivated: true
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
    const user = await UserModel.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    if(!user.isActivated) {
      return { error: "User blocked" };
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

    const tokenFromDb = await TokenService.findToken(token);
    const userData = await TokenService.validateRefreshToken(token);

    if (!userData || !tokenFromDb) {
      return { error: "Validation error" };
    }

    const user = await UserModel.findById(userData.id);
    if(!user.isActivated) {
      return { error: "User blocked" };
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