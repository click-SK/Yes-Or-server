import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import UserRouter from './router/UserRouter.js';
import AdminRouter from './router/AdminRouter.js';

dotenv.config();

const app = express();
const db = "mongodb+srv://roskichuk:qwerty12345@cluster0.efuq74u.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(db).then(() => {
  console.log("DB Start");
});

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());

app.use('/api/uploadsUser', express.static('uploadsUser'));
app.use('/api',UserRouter)
app.use('/api',AdminRouter)


app.listen(process.env.PORT, () => {
    console.log('server start', process.env.PORT);
  });