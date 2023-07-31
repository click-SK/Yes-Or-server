import * as AdminService from '../services/AdminService.js';

export const register = async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;

        const userData = await AdminService.registration(email, password, isAdmin);

        if (userData.error) {
        }
        res.cookie('Y-O-A-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 
        
    } catch (error) {
        console.error('Помилка реєстрації користувача:', error);
        res.status(500).json({ message: 'Не вдалося зареєструвати користувача' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await AdminService.login(email, password);
        if (userData.error) {
            return res.json({ message: userData.error });
        }

        res.cookie('Y-O-A-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 

    } catch(e) {
        console.log(e);
    }
}

export const logout = async (req,res) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await AdminService.logout(refreshToken);
        res.clearCookie('Y-O-A-refreshToken');
        return res.json(token);
    } catch (e) {
        console.log(e);
    }
}

export const refresh = async (req,res) => {
    try {
        const {refreshToken} = req.cookies;
        console.log('cookies refreshToken',refreshToken);
        const userData = await AdminService.refresh(refreshToken)
        if (userData.error) {
            return res.status(503).json({ message: userData.error });
        }
        res.cookie('Y-O-A-refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true})
        return res.json(userData); 
    } catch (e) {
        console.log(e);
    }
}