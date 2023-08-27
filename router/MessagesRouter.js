import { Router } from "express";
import * as MessagesController from '../controllers/MessagesController.js';

const router = new Router();

router.post('/create-messanger',MessagesController.createMessenger);
router.patch('/create-message',MessagesController.createMessage);
router.get('/get-current-messeges/:id',MessagesController.getCurrentMesseges);
export default router;