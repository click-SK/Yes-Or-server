import { Router } from "express";
import multer from 'multer';
import * as UsersController from '../controllers/UserController.js';
// import checkAuthUser from '../utils/checkAuthUser.js';

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

router.post('/register-user',upload.single('userImage'),UsersController.register);
router.post('/login-user',UsersController.login);
router.post('/logout-user',UsersController.logout);
router.get('/refresh-user',UsersController.refresh);
export default router;