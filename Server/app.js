import express from "express";
import userRouter from "./Routers/userRouter.js";

import cookieParser from "cookie-parser";
import { config } from "dotenv";

export const app = express();

config({
  path: "./.env",
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);


app.get("/", (req, res) => {
  res.send("Server is working fine");
});
