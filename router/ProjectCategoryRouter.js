import { Router } from "express";
import * as ProjectCategory from '../controllers/ProjectcategoryController.js';
const router = new Router();

router.post('/create-category',ProjectCategory.createCategory);
router.get('/get-all-category',ProjectCategory.getAllCategory);
export default router;