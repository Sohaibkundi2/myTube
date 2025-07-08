import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponce.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // 1. Get all videos by this channel
  const videos = await Video.find({ owner: channelId }).select("_id views");
  const videoIds = videos.map(video => video._id);

  // 2. Total videos
  const totalVideos = videos.length;

  // 3. Total views
  const totalViews = videos.reduce((sum, vid) => sum + (vid.views || 0), 0);

  // 4. Total likes across videos
  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds }
  });

  // 5. Total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId
  });

  // 6. Send response
  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalViews,
      totalLikes,
      totalSubscribers,
    }, "Channel statistics fetched successfully")
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params || {};

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 }) // Newest first
    .populate("owner", "username avatar"); // Only show username and avatar of the owner

  return res.status(200).json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  );
});



export {
    getChannelStats, 
    getChannelVideos
    }