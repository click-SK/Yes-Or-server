import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import moment from 'moment-timezone';

import UserRouter from './router/UserRouter.js';
import AdminRouter from './router/AdminRouter.js';
import ProjectRouter from './router/ProjectRouter.js';
import ProjectCategoryRouter from './router/ProjectCategoryRouter.js';
import MessagesRouter from './router/MessagesRouter.js';
import * as ProjectController from './controllers/ProjectController.js';

const kyivTime = moment().tz('Europe/Kiev');
const startTime = moment(kyivTime).set({ hour: 1, minute: 0, second: 0 }).valueOf();
const endTime = moment(kyivTime).set({ hour: 2, minute: 0, second: 0 }).valueOf();

dotenv.config();

const app = express();
const db = "mongodb+srv://roskichuk:qwerty12345@cluster0.efuq74u.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(db).then(() => {
  console.log("DB Start");
});

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [
    process.env.CLIENT_URL,
    process.env.LOCALHOST_URL
  ]
}));
app.use(cookieParser());

app.use('/api/uploadsUser', express.static('uploadsUser'));
app.use('/api/uploadsProject', express.static('uploadsProject'));
app.use('/api',UserRouter)
app.use('/api',AdminRouter)
app.use('/api',ProjectRouter)
app.use('/api',ProjectCategoryRouter)
app.use('/api',MessagesRouter)

setInterval(() => {
  const currentTime = Date.now();
  if (currentTime >= startTime && currentTime <= endTime) {
    ProjectController.сheckingEndTimeProject();
  }
}, 900000);

app.listen(process.env.PORT, () => {
    console.log('server start', process.env.PORT);
  });