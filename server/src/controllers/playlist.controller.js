import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});

export const getAllPlaylists = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});

export const getPlaylistDetail = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});

export const AddProblemToPlaylist = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});

export const deletePlaylist = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});

export const removeProblemFromPlaylist = asyncHandler((req, res) => {
  try {
  } catch (error) {
    res.status(error.status || 500).json(error.message);
  }
});
