import * as UserService from '../services/UserService.js';

export const register = async (req, res) => {
    try {
        const { email, firstName, lastName, password, socialNetwork, phone, passport, requisites, isVerified } = req.body;

        const userData = await UserService.registration(email, firstName, lastName, password, socialNetwork, phone, passport, requisites, isVerified);

        if (userData.error) {
        }
        res.cookie('Y-O-U-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 
        
    } catch (error) {
        console.error('Помилка реєстрації користувача:', error);
        res.status(500).json({ message: 'Не вдалося зареєструвати користувача' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await UserService.login(email, password);
        if (userData.error) {
            return res.json({ message: userData.error });
        }

        res.cookie('Y-O-U-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 

    } catch(e) {
        console.log(e);
    }
}

export const logout = async (req,res) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await UserService.logout(refreshToken);
        res.clearCookie('Y-O-U-refreshToken');
        return res.json(token);
    } catch (e) {
        console.log(e);
    }
}

export const refresh = async (req,res) => {
    try {
        const {refreshToken} = req.cookies;
        console.log('cookies refreshToken',refreshToken);
        const userData = await UserService.refresh(refreshToken)
        if (userData.error) {
            return res.status(503).json({ message: userData.error });
        }
        res.cookie('Y-O-U-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 
    } catch (e) {
        console.log(e);
    }
}