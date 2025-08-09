import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema(
  {
    likedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index(
  { likedBy: 1, video: 1 },
  { unique: true }
);

export const Like = mongoose.model('Like', likeSchema);
