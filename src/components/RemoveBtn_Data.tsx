'use client';

import { deleteData } from '@/actions/dataActions';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function RemoveBtn({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('게시글을 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await deleteData(id);
        alert('게시글이 성공적으로 삭제되었습니다.');
        router.push('/RequestPage');
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <button className="text-red-600 hover:text-red-800" onClick={handleDelete}>
      <HiOutlineTrash size={24} />
    </button>
  );
}
