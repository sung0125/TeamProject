'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // 검색 버튼 클릭 시 동작
  const handleSearch = () => {
    if (!query.trim()) {
      alert('검색어를 입력하세요'); // 검색어가 비어 있을 때 알림 메시지
      return;
    }
    router.push(`/search?query=${encodeURIComponent(query)}`); // 검색 결과 페이지로 이동
  };

  // Enter 키 입력 시 동작
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Enter 키를 누르면 검색 실행
    }
  };

  return (
    <div className='flex justify-center items-center pt-4 bg-sky-100'>
      {/* 중앙 정렬 */}
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // Enter 키 이벤트 처리
        placeholder='도서를 검색하세요'
        className='w-2/3 p-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-black' // 텍스트 색상 검은색
      />
      <button
        onClick={handleSearch}
        className='ml-2 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600'
      >
        검색
      </button>
    </div>
  );
}

export default SearchBar;
