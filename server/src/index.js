import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
const port = process.env.PORT;

app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
