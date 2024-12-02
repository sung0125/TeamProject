import mongoose, { Schema } from 'mongoose'
const topicSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
)
const Topic = mongoose.models.Test || mongoose.model('Test', topicSchema)
export default Topic
