import mongoose from 'mongoose'
import { Like } from '../models/like.model.js'
import ApiError from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponce.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Toggle Video Like
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, 'Invalid or missing video ID')
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id
  })

  if (existingLike) {
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200, null, 'Like removed from video'))
  }

  const newLike = new Like({
    likedBy: req.user._id,
    video: videoId
  })

  await newLike.save()

  return res.status(200).json(new ApiResponse(200, newLike, 'Video liked successfully'))
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
        select: 'username fullName avatar'
      }
    })
    .sort({ createdAt: -1 })

  const likedVideos = likes.map(like => like.video).filter(Boolean)

  return res.status(200).json(
    new ApiResponse(200, likedVideos, 'Liked videos fetched successfully')
  )
})

// Get video like count
const getVideoLikeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, 'Invalid or missing video ID')
  }

  const count = await Like.countDocuments({ video: videoId })

  return res.status(200).json(
    new ApiResponse(200, { count }, 'Like count fetched successfully')
  )
})

export {
  toggleVideoLike,
  getLikedVideos,
  getVideoLikeCount
}
