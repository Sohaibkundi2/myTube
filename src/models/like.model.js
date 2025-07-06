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

likeSchema.index({ likedBy: 1, comment: 1 }, { unique: true, sparse: true });
likeSchema.index({ likedBy: 1, video: 1 }, { unique: true, sparse: true });
likeSchema.index({ likedBy: 1, tweet: 1 }, { unique: true, sparse: true });

export const Like = mongoose.model('Like', likeSchema)
