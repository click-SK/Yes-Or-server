import * as AdminService from "../services/AdminService.js";

export const register = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    const userData = await AdminService.registration(email, password, isAdmin);

    if (userData.error) {
    }
    await res.cookie('Y_O_A_refreshToken', userData.refreshToken, {
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

    const userData = await AdminService.login(email, password);
    if (userData.error) {
      return res.json({ message: userData.error });
    }

    await res.cookie('Y_O_A_refreshToken', userData.refreshToken, {
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
    const { Y_O_A_refreshToken } = req.cookies;
    const token = await AdminService.logout(Y_O_A_refreshToken);
    res.clearCookie("Y_O_A_refreshToken");
    return res.json(token);
  } catch (e) {
    console.log(e);
  }
};

export const refresh = async (req, res) => {
  try {
    const { Y_O_A_refreshToken } = req.cookies;
    const userData = await AdminService.refresh(Y_O_A_refreshToken);
    if (userData.error) {
      return res.status(503).json({ message: userData.error });
    }
    await res.cookie('Y_O_A_refreshToken', userData.refreshToken, {
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
