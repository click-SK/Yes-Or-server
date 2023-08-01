import { Router } from "express";
import multer from 'multer';
import * as UsersController from '../controllers/UserController.js';
import authMiddleware from "../moddlewares/auth-middleware.js";
import fs from 'fs';
const router = new Router();

const storage = multer.diskStorage({
    destination: (_,__,cd) => {
        if(!fs.existsSync('uploadsUser')) {
            fs.mkdirSync('uploadsUser');
        }
        cd(null,'uploadsUser')
    },
    filename: (_,file,cd) => {
        cd(null, file.originalname)
    },
})

const upload = multer({storage})

router.post('/register-user',UsersController.register);
router.post('/login-user',UsersController.login);
router.post('/logout-user',UsersController.logout);
router.get('/refresh-user',UsersController.refresh);
router.get('/get-me/:id',authMiddleware,UsersController.getMe);
router.patch('/update-user-data',upload.single('userImage'),UsersController.updateUserData);
router.patch('/update-user-password',UsersController.updateUserPassword);
export default router;