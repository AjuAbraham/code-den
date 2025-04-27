import { Router } from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.post("/check", authMiddleware, checkUser);

export default authRouter;
