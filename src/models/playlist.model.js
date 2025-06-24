import mongoose, { Schema } from 'mongoose'

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Video',
        required: true,
        trim: true,
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

export const Playlist = mongoose.model('Playlist', playlistSchema)
