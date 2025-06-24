import mongoose, { Schema } from 'mongoose'

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
        trim: true,
        maxlength: 280
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)
export const Tweet = mongoose.model('Tweet', tweetSchema)
