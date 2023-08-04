import jwt from 'jsonwebtoken';
import TokenModel from '../models/AdminToken.js';

export const generateTokens = async (payload) => {
    try {
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn: '1d'});
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    } catch (e) {
        console.log(e);
    }
}

export const saveTokens = async (userId, refreshToken) => {
    try {
        const tokenData = await TokenModel.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
    } catch (e) {
        console.log(e);
    }
}

export const removeToken = async (refreshToken) => {
    try {
        const tokenData = await TokenModel.deleteOne({refreshToken});
        return tokenData;
    } catch (e) {
        console.log(e);
    }
}
export const validateRefreshToken = async (token) => {
    try {
        const userData = jwt.verify(token, process.env.SECRET_KEY_REFRESH);
        if(!userData) {
            return { error: 'User not found' };
        }
        return userData
    } catch (e) {
        return null;
    }
}

export const validateAccessToken = async (token) => {
    try {
        const userData = await jwt.verify(token, process.env.SECRET_KEY_ACCESS);
        return userData;
        
    } catch (e) {
        return null;
    }
}

export const findToken = async (refreshToken) => {
    try {
        const tokenData = await TokenModel.findOne({refreshToken});
        return tokenData;
    } catch (e) {
        console.log(e);
    }
}