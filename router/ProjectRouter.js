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
router.patch('/update-project',upload.array('projectMedia'),ProjectController.updateProject);
router.get('/get-all-projects',ProjectController.getAllProject);
router.get('/get-one-project/:id', ProjectController.getOneProject);
router.patch('/saved-project', ProjectController.savedProject);
router.patch('/donats-project', ProjectController.donatsToProject);
router.patch('/remove-saved-project', ProjectController.removeSavedProject);
router.post('/add-project-to-verified', ProjectController.addVerifiedProject);
router.post('/add-project-to-not-verified', ProjectController.removeVerifiedProject);
router.get('/get-all-verified-projects', ProjectController.getAllVerifiedProject);
router.get('/get-all-not-verified-projects', ProjectController.getAllNotVerifiedProject);
router.get('/get-project-main-page', ProjectController.getMainPageProjects);
router.post('/add-project-main-page', ProjectController.addProjectToMainPage);
router.delete('/remove-project-main-page', ProjectController.removeProjectFromMainPage);
router.patch('/add-project-comment', ProjectController.addComment);
export default router;