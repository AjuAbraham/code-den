import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import problemRouter from "./routes/problem.routes.js";
import executionRouter from "./routes/execution.routes.js";
import submissionRouter from "./routes/submissions.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import solutionRouter from "./routes/solutions.routes.js";
import "./cronjobs/ResetStreaks.js";
import suggestionRouter from "./routes/suggestions.routes.js";
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
const port = process.env.PORT;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute", executionRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/solutions", solutionRouter)
app.use("/api/v1/suggestion", suggestionRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
