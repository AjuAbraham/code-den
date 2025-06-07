import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { getAllProblems } from "../../../client/src/lib/axios.js";

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
    const allPlaylists = await db.playlist.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!allPlaylists) {
      throw new ErrorHandler(404, "Unable to fetch playlist");
    }
    const playlistsWithCounts = allPlaylists.map((playlist) => {
      const problemCounts = playlist.problemInPlaylist.reduce(
        (acc, { problem }) => {
          if (problem.difficulty === "EASY") {
            acc.easyCount += 1;
          } else if (problem.difficulty === "MEDIUM") {
            acc.mediumCount += 1;
          } else if (problem.difficulty === "HARD") {
            acc.hardCount += 1;
          }
          return acc;
        },
        { easyCount: 0, mediumCount: 0, hardCount: 0 }
      );
      return {
        ...playlist,
        problemCounts,
      };
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "playlist fetched successfully",
          playlistsWithCounts
        )
      );
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
    const formattedRes = playlist.problemInPlaylist.map(
      ({ problem, ...rest }) => {
        return {
          ...rest,
          ...problem,
        };
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, "Playlist fetched successfully", {
          ...playlist,
          problemInPlaylist: formattedRes,
        })
      );
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
