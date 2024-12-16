import mongoose from 'mongoose';

const QandaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,  
  }
);

const Qanda = mongoose.models.Qanda || mongoose.model('Qanda', QandaSchema);
export default Qanda;