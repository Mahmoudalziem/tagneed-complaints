import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes'
import complaintsRoutes from './routes/complaintsRoutes';
import commissionRoutes from './routes/commissionRoutes';
import cors from 'cors'

const app = express();

app.set('views', path.join('views'));

app.set('view engine', 'pug');

app.use(logger("tiny"));

app.use(cors("*"));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.raw({ type: 'application/octet-stream', limit: '20mb' }));

app.use(express.json({ limit: "20mb" }));

app.use(cookieParser());

app.use(express.static(path.join('public')));

/// routes

app.use('/auth', authRoutes);

app.use('/complaints', complaintsRoutes);

app.use('/commission', commissionRoutes);

/////

mongoose.connect("mongodb://localhost/complaints", {
    useNewUrlParser: true,
}).then((err, res) => {
    console.log("mongoose is connected");
}).catch(err => {
    console.log("err", err);
})

export default app;