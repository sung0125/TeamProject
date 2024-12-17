'use client'

import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from '@/actions/commentActions'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Comment = {
  _id: string
  postId: string
  postType: 'topic' | 'data' | 'commu' | 'qanda'
  parentId?: string
  author: string
  content: string
  createdAt: string
  depth: number
  replies?: Comment[]
}

type CommentSectionProps = {
  postId: string
  postType: 'topic' | 'data' | 'commu' | 'qanda'
}

export default function CommentSection({
  postId,
  postType,
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      try {
        const response = await getCommentsByPostId(postId, postType)
        if (response.success && Array.isArray(response.comments)) {
          setComments(response.comments)
        }
      } catch (error) {
        console.error('댓글 로딩 에러:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId, postType])

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    if (!session) {
      alert('댓글을 작성하려면 로그인이 필요합니다.')
      return
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)
      const response = await createComment(
        postId,
        postType,
        session.user?.name || '익명',
        newComment.trim(),
        parentId
      )

      if (response.success) {
        setNewComment('')
        setReplyTo(null)
        const refreshedComments = await getCommentsByPostId(postId, postType)
        if (refreshedComments.success) {
          setComments(refreshedComments.comments)
        }
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      alert('로그인이 필요합니다.')
      return
    }

    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        const response = await deleteComment(commentId)
        if (response.success) {
          const refreshedComments = await getCommentsByPostId(postId, postType)
          if (refreshedComments.success) {
            setComments(refreshedComments.comments)
          }
        }
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
        alert('댓글 삭제에 실패했습니다.')
      }
    }
  }

  // 댓글 렌더링
  const renderComment = (comment: Comment) => (
    <div
      key={comment._id}
      className={`border-b pb-4 ${comment.depth > 0 ? 'ml-8' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{comment.author}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {session?.user?.name === comment.author && (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 mb-2">{comment.content}</p>

      {/* 답글 버튼 */}
      {session && comment.depth === 0 && (
        <button
          onClick={() =>
            setReplyTo(replyTo === comment._id ? null : comment._id)
          }
          className="text-sky-600 hover:text-sky-800 text-sm"
        >
          {replyTo === comment._id ? '답글 취소' : '답글 작성'}
        </button>
      )}

      {/* 답글 작성 폼 */}
      {replyTo === comment._id && (
        <form
          onSubmit={(e) => handleCommentSubmit(e, comment._id)}
          className="mt-2 ml-8"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="답글을 작성하세요..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-sky-500"
            rows={2}
            required
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 px-4 py-1 text-white rounded-lg ${
              submitting ? 'bg-gray-400' : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            {submitting ? '작성 중...' : '답글 작성'}
          </button>
        </form>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4">
          {comment.replies.map((reply) => renderComment(reply))}
        </div>
      )}
    </div>
  )

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">댓글</h2>

      {/* 댓글 작성 폼 */}
      <form onSubmit={(e) => handleCommentSubmit(e)} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성하세요..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:border-sky-500"
          rows={3}
          required
          disabled={submitting}
        />
        {session ? (
          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 px-4 py-2 text-white rounded-lg ${
              submitting ? 'bg-gray-400' : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            {submitting ? '작성 중...' : '댓글 작성'}
          </button>
        ) : (
          <Link
            href="/login"
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 inline-block"
          >
            로그인 후 작성 가능
          </Link>
        )}
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {loading ? (
          <p>댓글을 불러오는 중...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-gray-500">아직 작성된 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
