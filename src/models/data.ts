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
const Data = mongoose.models.Data || mongoose.model('Data', topicSchema)
export default Data
