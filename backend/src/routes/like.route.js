import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getVideoLikeCount
} from '../controllers/like.controller.js'

const router = express.Router()

// Like/unlike a video
router.patch('/videos/:videoId/toggle', verifyJWT, toggleVideoLike)

// Like/unlike a comment
router.patch('/comments/:commentId/toggle', verifyJWT, toggleCommentLike)

// Like/unlike a tweet
router.patch('/tweets/:tweetId/toggle', verifyJWT, toggleTweetLike)

// Get all liked videos by current user
router.get('/videos', verifyJWT, getLikedVideos)

// Get total like count for a video
router.get('/videos/:videoId/count', getVideoLikeCount);

export default router
