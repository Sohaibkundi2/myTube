import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  toggleVideoLike,
  getLikedVideos,
  getVideoLikeCount,
} from '../controllers/like.controller.js';

const router = express.Router();

// Like/unlike a video
router.patch('/videos/:videoId/toggle', verifyJWT, toggleVideoLike);

// Get all liked videos by current user
router.get('/videos', verifyJWT, getLikedVideos);

// Get total like count for a video
router.get('/videos/:videoId/count', getVideoLikeCount);

export default router;
