// models/ReadingData.ts
import mongoose from 'mongoose'

const readingDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  booksRead: {
    type: Number,
    default: 0,
  },
  pagesRead: {
    type: Number,
    default: 0,
  },
  readingGoal: {
    type: Number,
    default: 5,
  },
  monthlyStats: {
    type: Map,
    of: Number,
    default: {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    },
  },
  readingDays: [String],
})

const ReadingData =
  mongoose.models.ReadingData ||
  mongoose.model('ReadingData', readingDataSchema)
export default ReadingData
