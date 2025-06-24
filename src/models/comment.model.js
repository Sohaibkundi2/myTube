
import mongoose, {Schema} from "mongoose";
import mongooseAggrigatePaginate from "mongoose-paginate-v2"
const commentSchema =new Schema({
        content: {
          type: String,
          required: true,
          trim:true
        },
        owner: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required:true
        },
        video: {
          type: mongoose.Types.ObjectId,
          ref: 'Video',
          required:true
        },
}, { timestamps: true })

commentSchema.plugin(mongooseAggrigatePaginate)

export const Comment = mongoose.model("Comment",commentSchema)