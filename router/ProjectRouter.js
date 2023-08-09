import { Router } from "express";
import multer from 'multer';
import * as ProjectController from '../controllers/ProjectController.js';
import fs from 'fs';
const router = new Router();

const storage = multer.diskStorage({
    destination: (_,__,cd) => {
        if(!fs.existsSync('uploadsProject')) {
            fs.mkdirSync('uploadsProject');
        }
        cd(null,'uploadsProject')
    },
    filename: (_,file,cd) => {
        cd(null, file.originalname)
    },
})

const upload = multer({storage})

router.post('/create-project',upload.array('projectMedia'),ProjectController.createProject);
router.get('/get-all-projects',ProjectController.getAllProject);
router.get('/get-one-project/:id', ProjectController.getOneProject);
export default router;