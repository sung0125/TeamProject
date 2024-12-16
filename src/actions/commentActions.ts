"use server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { convertDocToObj } from "@/libs/helpers";
import connectMongoDB from "@/libs/mongodb";
import Comment from "@/models/comment";
import { revalidatePath } from "next/cache";

type PostType = 'topic' | 'data' | 'commu' | 'qanda';

// 댓글 생성
export async function createComment(
  postId: string,
  postType: PostType,
  author: string,
  content: string,
  parentId?: string
) {
  try {
    await connectMongoDB();
    const commentData = {
      postId,
      postType,
      author,
      content,
      depth: parentId ? 1 : 0
    };
    if (parentId) {
      (commentData as any).parentId = parentId;
    }

    const comment = await Comment.create(commentData);
    console.log("생성된 댓글:", comment);

    revalidatePath(`/${postType}Page/${postId}`);
    return { 
      success: true, 
      comment: JSON.parse(JSON.stringify(comment)) 
    };
  } catch (error) {
    console.error("댓글 작성 에러:", error);
    return { success: false, error: "댓글 작성에 실패했습니다." };
  }
}

// 특정 게시글의 모든 댓글 가져오기
export async function getCommentsByPostId(postId: string, postType: PostType) {
  try {
    await connectMongoDB();
    // 먼저 일반 댓글을 가져옴
    const mainComments = await Comment.find({ 
      postId,
      postType,
      depth: 0
    }).sort({ createdAt: -1 });

    // 각 댓글의 대댓글을 가져옴
    const commentsWithReplies = await Promise.all(
      mainComments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id,
          depth: 1
        }).sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies: replies.map(reply => reply.toObject())
        };
      })
    );
    
    console.log("조회된 댓글들:", commentsWithReplies);

    return { 
      success: true, 
      comments: JSON.parse(JSON.stringify(commentsWithReplies))
    };
  } catch (error) {
    console.error("댓글 조회 에러:", error);
    return { 
      success: false, 
      error: "댓글 조회에 실패했습니다.",
      comments: [] 
    };
  }
}

// 댓글 삭제
export async function deleteComment(commentId: string) {
  try {
    await connectMongoDB();
    // 댓글과 관련된 대댓글도 함께 삭제
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return { success: false, error: "댓글을 찾을 수 없습니다." };
    }

    await Comment.deleteMany({ 
      $or: [
        { _id: commentId },
        { parentId: commentId }
      ]
    });

    console.log("삭제된 댓글:", comment);

    revalidatePath(`/${comment.postType}Page/${comment.postId}`);
    return { success: true };
  } catch (error) {
    console.error("댓글 삭제 에러:", error);
    return { success: false, error: "댓글 삭제에 실패했습니다." };
  }
}