import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    if (!title) {
      throw new ErrorHandler(400, "title is requried");
    }
    const exsistingPlaylist = await db.playlist.findUnique({
      where: {
        title_userId: {
          title,
          userId,
        },
      },
    });
    if (exsistingPlaylist) {
      throw new ErrorHandler(400, "Playlist with this title already exsist");
    }
    const newPlaylist = await db.playlist.create({
      data: {
        title,
        description: description ? description : null,
        userId,
      },
    });
    if (!newPlaylist) {
      throw new ErrorHandler(500, "Unable to create playlist");
    }
    res.status(201).json(new ApiResponse(201, "Playlist created Successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getAllPlaylists = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const allPaylists = await db.playlist.findMany({
      where: {
        userId,
      },
      include: {
        problemInPlaylist: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!allPaylists) {
      throw new ErrorHandler(404, "Unable to fetch playlist");
    }
    res
      .status(200)
      .json(new ApiResponse(200, "playlist fetched successfully", allPaylists));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getPlaylistDetail = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;
    if (!playlistId) {
      throw new ErrorHandler(400, "Playlist Id is required");
    }
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId,
      },
      include: {
        problemInPlaylist: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      throw new ErrorHandler(404, "Unable to fetch playlist details");
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const AddProblemToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { problemIds = [] } = req.body;
    const { playlistId } = req.params;
    if (!problemIds || problemIds.length === 0) {
      throw new ErrorHandler(400, "Problem must be provided");
    }
    const updatedPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });
    if (!updatedPlaylist) {
      throw new ErrorHandler(500, "Unable to add problem to playlist");
    }
    res.status(201).json(new ApiResponse(201, "Problem added successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) {
      throw new ErrorHandler(400, "Playlist id is required");
    }
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    if (!deletedPlaylist) {
      throw new ErrorHandler(500, "Unable to delete the playlist");
    }
    res.status(200).json(new ApiResponse(200, "Playlist deleted successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ErrorHandler(400, "problem id are required");
    }
    const deltedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    if (!deltedProblem) {
      throw new ErrorHandler(
        500,
        "Unable to delete the problem from the playlist"
      );
    }
    res.status(200).json(new ApiResponse(200, "Problem removed successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});
