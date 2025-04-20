import { Router } from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/check", checkUser);

export default authRouter;
