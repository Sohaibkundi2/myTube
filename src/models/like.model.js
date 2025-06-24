import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    likedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: 'Video',
    },
    tweet: {
      type: mongoose.Types.ObjectId,
      ref: 'Tweet',
    },
  },
  { timestamps: true },
)

export const Like = mongoose.model('Like', likeSchema)
