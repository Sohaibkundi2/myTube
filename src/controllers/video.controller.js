import mongoose, { isValidObjectId } from 'mongoose'
import { Video } from '../models/video.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = 'createdAt',
    sortType = 'desc',
    userId,
  } = req.query

  const filter = {
    isPublished: true,
  }

  if (query) {
    filter.title = { $regex: query, $options: 'i' } // case-insensitive search on title
  }

  try {
    if (userId) {
      filter.owner = new mongoose.Types.ObjectId(userId)
    }
  } catch (error) {
    throw new ApiError(400, 'Invalid user ID')
  }

  const skip = (page - 1) * limit
const sortOption = {};
sortOption[sortBy || "createdAt"] = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('owner', 'username fullName avatar')

  const totalCount = await Video.countDocuments(filter)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, totalCount, page: Number(page), limit: Number(limit) },
        'Videos fetched successfully',
      ),
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
