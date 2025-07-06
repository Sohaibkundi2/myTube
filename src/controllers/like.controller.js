import mongoose, { isValidObjectId } from 'mongoose'
import { Like } from '../models/like.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params || {}

  if (!videoId) {
    throw new ApiError(400, 'video id is missing')
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(401, 'invalid video id')
  }
  let alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  })

  if (alreadyLiked) {
    await alreadyLiked.deleteOne()

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Like removed from video'))
  }

  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, 'video liked successfully'))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params || {}

  if (!commentId) {
    throw new ApiError(400, 'Comment ID is missing')
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, 'Invalid comment ID')
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  })

  if (existingLike) {
    await existingLike.deleteOne()

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Like removed from comment'))
  }

  const newLike = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, 'Comment liked successfully'))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params || {}

  if (!tweetId) {
    throw new ApiError(400, 'tweet ID is missing')
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, 'Invalid tweet ID')
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  })

  if (existingLike) {
    await existingLike.deleteOne()

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Like removed from tweet'))
  }

  const newLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, 'tweet liked successfully'))
})

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(401, 'User not authenticated')
  }
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

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, 'Liked videos fetched successfully'),
    )
})

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos }
