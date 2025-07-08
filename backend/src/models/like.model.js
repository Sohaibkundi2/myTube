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

likeSchema.pre('validate', function (next) {
  const targets = [this.video, this.comment, this.tweet].filter(Boolean)
  if (targets.length !== 1) {
    return next(new Error("A like must reference exactly one of video, comment, or tweet."))
  }
  next()
})

likeSchema.index(
  { likedBy: 1, video: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true } } }
)
likeSchema.index(
  { likedBy: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
)
likeSchema.index(
  { likedBy: 1, tweet: 1 },
  { unique: true, partialFilterExpression: { tweet: { $exists: true } } }
)

export const Like = mongoose.model('Like', likeSchema)
