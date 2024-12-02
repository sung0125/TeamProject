'use client'
import { deleteTopic } from '@/actions/topicActions'
import { HiOutlineTrash } from 'react-icons/hi'
export default function RemoveBtn({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = confirm('이 토픽을 삭제하시겠습니까?')
    if (confirmed) {
      try {
        await deleteTopic(id)
      } catch (error) {
        console.error('삭제 중 오류 발생:', error)
        alert('삭제 중 오류가 발생했습니다.')
      }
    }
  }
  return (
    <button className="text-red-600 hover:text-red-800" onClick={handleDelete}>
      <HiOutlineTrash size={24} />
    </button>
  )
}
