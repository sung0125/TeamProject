import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  // 게시글 ID
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // 게시판 타입 추가
  postType: {
    type: String,
    required: true,
    enum: ['topic', 'data', 'commu', 'qanda'], 
  },
  parentId: {  // 부모 댓글 ID (대댓글인 경우)
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  depth: {  // 댓글 깊이 (0: 일반 댓글, 1: 대댓글)
    type: Number,
    default: 0
  }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;