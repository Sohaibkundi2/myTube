import mongoose, { isValidObjectId } from 'mongoose'
import { Video } from '../models/video.model.js'
import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponce.js'
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
  } = req.query;

  const filter = {
    isPublished: true,
  };

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  if (userId) {
    try {
      filter.owner = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      throw new ApiError(400, 'Invalid user ID');
    }
  }

  const sort = {};
  sort[sortBy] = sortType === 'asc' ? 1 : -1;

  const aggregate = Video.aggregate([
    { $match: filter },
    { $sort: sort },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: {
      path: 'owner',
      select: 'username fullName avatar',
    },
  };

  const result = await Video.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(200, {
      videos: result.docs,
      totalCount: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    }, "Videos fetched successfully")
  );
});


const publishAVideo = asyncHandler(async (req, res) => {
const { title, description } = req.body || {};

if (!title || !description) {
  throw new ApiError(400, "Title and description are required");
}
  const existingVideo = await Video.findOne({
        $or:[{title},{description}]
  })

  if (existingVideo) {
    throw new ApiError(400, "Video with similar title or description already exists");
  }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath || !thumbnailLocalPath) {
      throw new ApiError(400, "Video file and thumbnail are required");
    }

    let videoFileUrl, thumbnailUrl;
    try {
      videoFileUrl = await uploadOnCloudinary(videoFileLocalPath);
      thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);
    }catch (error) {
      throw new ApiError(500, "Error uploading files to cloud storage");
    }

    if (!videoFileUrl?.url || !thumbnailUrl?.url) {
  throw new ApiError(500, "Cloud upload failed");
}


  const video = new Video({
    title,
    description,
    videoFile: videoFileUrl?.url,
    thumbnail: thumbnailUrl?.url,
    duration: Math.round(videoFileUrl?.duration),
    owner: req.user?._id,
  })

  const savedVideo = await video.save()

  return res.status(201).json(
    new ApiResponse(201, savedVideo, "Video published successfully")
  )
})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

    const video = await Video.findById(videoId).populate('owner', 'username fullName avatar');

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(
    new ApiResponse(200, video, "Video fetched successfully")
  );
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  // 5. Handle thumbnail upload if present
  const thumbnailLocalPath = req?.file?.path;
  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (uploadedThumbnail?.url) {
      video.thumbnail = uploadedThumbnail.url;
    }
  }

  const updatedVideo = await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(videoId)){
    throw new ApiError(400, "Invalid Video ID")
  }

  const video = await Video.findById(videoId)

  if(!video){
    throw new ApiError(404, "Video not found")
  }

  if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You are not allowed to delete this video")
  }

  await video.deleteOne()

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to toggle publish status for this video");
  }

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video publish status toggled successfully"));
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
