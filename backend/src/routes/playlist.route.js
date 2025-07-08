import express from "express"
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
} from "../controllers/playlist.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

//  Create a new playlist (only logged-in users)
router.post("/", verifyJWT, createPlaylist)

// Get all playlists by a user (public)
router.get("/user/:userId", getUserPlaylists)

//  Get one playlist by ID (public)
router.get("/:playlistId", getPlaylistById)

// Add a video to a playlist (only logged-in)
router.patch("/:playlistId/add/:videoId", verifyJWT, addVideoToPlaylist)

//  Remove a video from a playlist (only logged-in)
router.patch("/:playlistId/remove/:videoId", verifyJWT, removeVideoFromPlaylist)

//  Delete a playlist (only logged-in)
router.delete("/:playlistId", verifyJWT, deletePlaylist)

// Update a playlist's name or description (only logged-in)
router.put("/:playlistId", verifyJWT, updatePlaylist)

export default router
