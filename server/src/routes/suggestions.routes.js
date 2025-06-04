import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userSuggestion } from "../controllers/suggestion.controller.js";

const suggestionRouter = Router();

suggestionRouter.post("/", authMiddleware, userSuggestion);

export default suggestionRouter;
