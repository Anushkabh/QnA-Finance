import express from "express";
import userRouter from "./Routers/userRouter.js";
import questionRouter from "./Routers/quesRouter.js";

import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";

export const app = express();

config({
  path: "./.env",
});


// Configure CORS middleware
app.use(cors({
  origin: ["http://localhost:5173"], // Replace with your frontend's domain for production
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
  credentials: true, // If your frontend uses cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/question", questionRouter);


app.get("/", (req, res) => {
  res.send("Server is working fine");
});
