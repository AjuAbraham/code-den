import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  AddProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistDetail,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.post("/create", authMiddleware, createPlaylist);
playlistRouter.get("/getall", authMiddleware, getAllPlaylists);
playlistRouter.get("/get/:playlistId", authMiddleware, getPlaylistDetail);
playlistRouter.post(
  "/:playlistId/add-problem",
  authMiddleware,
  AddProblemToPlaylist
);
playlistRouter.delete(
  "/:playlistId/delete-playlist",
  authMiddleware,
  deletePlaylist
);
playlistRouter.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRouter;
