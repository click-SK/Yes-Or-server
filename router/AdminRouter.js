import { Router } from "express";
import multer from 'multer';
import * as AdminController from '../controllers/AdminController.js';
// import checkAuthUser from '../utils/checkAuthUser.js';

const router = new Router();

router.post('/register-admin',AdminController.register);
router.post('/login-admin',AdminController.login);
router.post('/logout-admin',AdminController.logout);
router.get('/refresh-admin',AdminController.refresh);
export default router;