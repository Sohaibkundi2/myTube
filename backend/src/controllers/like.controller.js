import mongoose from 'mongoose'
import { Like } from '../models/like.model.js'
import ApiError from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponce.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Toggle Video Like
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId) throw new ApiError(400, 'Video ID is missing')
  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, 'Invalid video ID')

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  })

  if (existingLike) {
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200, null, 'Like removed from video'))
  }

  const newLike = new Like({
    likedBy: req.user._id,
    video: videoId,
  })

  newLike.comment = undefined
  newLike.tweet = undefined
  await newLike.save()

  return res.status(200).json(new ApiResponse(200, newLike, 'Video liked successfully'))
})

// Toggle Comment Like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params

  if (!commentId) throw new ApiError(400, 'Comment ID is missing')
  if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, 'Invalid comment ID')

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  })

  if (existingLike) {
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200, null, 'Like removed from comment'))
  }

  const newLike = new Like({
    likedBy: req.user._id,
    comment: commentId,
  })

  newLike.video = undefined
  newLike.tweet = undefined
  await newLike.save()

  return res.status(200).json(new ApiResponse(200, newLike, 'Comment liked successfully'))
})

// Toggle Tweet Like
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params

  if (!tweetId) throw new ApiError(400, 'Tweet ID is missing')
  if (!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400, 'Invalid tweet ID')

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  })

  if (existingLike) {
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200, null, 'Like removed from tweet'))
  }

  const newLike = new Like({
    likedBy: req.user._id,
    tweet: tweetId,
  })

  newLike.video = undefined
  newLike.comment = undefined
  await newLike.save()

  return res.status(200).json(new ApiResponse(200, newLike, 'Tweet liked successfully'))
})

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID')
  }

  const likes = await Like.find({ likedBy: userId, video: { $exists: true } })
    .populate({
      path: 'video',
      populate: {
        path: 'owner',
        select: 'username fullName avatar',
      },
    })
    .sort({ createdAt: -1 })

  const likedVideos = likes.map(like => like.video).filter(Boolean)

  return res.status(200).json(
    new ApiResponse(200, likedVideos, 'Liked videos fetched successfully')
  )
})

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
}
