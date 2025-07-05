import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if(!content?.trim()){
        throw new ApiError(400, "content is required")
    }
      content = content?.trim();
    if(content.length < 1){
        throw new ApiError(400, "content must be at least 1 character")
    }

    if(content?.length > 280){
        throw new ApiError(400, "content must be less than 280 characters")
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,tweet,"Tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.params.userId

      if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

    const userExists = await User.findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ owner: userId })
  .populate("owner", "username fullName avatar")
  .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, tweets, "Fetched all tweets of user successfully")
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.tweetId;
  let { content } = req.body; 

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  if (!content || typeof content !== "string") {
    throw new ApiError(400, "Content is required");
  }

  content = content.trim();

  if (content.length < 1) {
    throw new ApiError(400, "Content must be at least 1 character");
  }

  if (content.length > 280) {
    throw new ApiError(400, "Content must be less than 280 characters");
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});


const deleteTweet = asyncHandler(async (req, res) => {
     const tweetId = req.params.tweetId;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

    await tweet.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}