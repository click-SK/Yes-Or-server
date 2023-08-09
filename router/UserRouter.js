import { Router } from "express";
import multer from 'multer';
import * as UsersController from '../controllers/UserController.js';
import authMiddleware from "../moddlewares/auth-middleware.js";
import adminMiddleware from "../moddlewares/admin-middleware.js";
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
router.patch('/upload-user-document',upload.array('userDocuments'),UsersController.uploadUserDocuments);
router.get('/get-me/:id',authMiddleware,UsersController.getMe);
router.get('/get-all-users',adminMiddleware,UsersController.getAllUsers);
router.patch('/update-user-data',upload.single('userImage'),UsersController.updateUserData);
router.patch('/update-user-password',UsersController.updateUserPassword);
router.patch('/update-user-activated',UsersController.blockedUser);
router.patch('/update-user-verified',UsersController.verifiedUser);
router.get('/get-my-projects/:id',UsersController.getMyProjects);
export default router;