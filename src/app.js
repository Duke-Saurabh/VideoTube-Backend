import express from "express";
import cookieParser from "cookie-parser";

const app=express();
import cors from "cors";
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter);
app.get("/",(req,res)=>{
    res.send('HELLO!')
});






export {app};