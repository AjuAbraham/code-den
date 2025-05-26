import { Router } from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
  topContributers,
} from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/check", authMiddleware, checkUser);
authRouter.get("/top", authMiddleware, topContributers);

export default authRouter;
