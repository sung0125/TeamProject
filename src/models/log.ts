import mongoose, { Schema } from 'mongoose'
const logSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
const Log = mongoose.models.Test_Log || mongoose.model('Test_Log', logSchema)
export default Log
