import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userSuggestion } from "../controllers/suggestion.controller.js";

const suggestionRouter = Router();

suggestionRouter.get("/get", authMiddleware, userSuggestion);

export default suggestionRouter;
