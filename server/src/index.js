import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
