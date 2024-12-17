'use client'
import { createTopic } from '@/actions/topicActions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AddTopicForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [extendedGenre, setExtendedGenre] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  const genreHierarchy = {
    소설: ['로맨스', '판타지', '추리'],
    비소설: ['자서전', '역사', '에세이'],
    과학: ['물리', '생물', '천문학'],
    기술: ['프로그래밍', '데이터', '보안'],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.name) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!selectedGenre || !extendedGenre) {
      alert('장르를 선택해주세요.')
      return
    }

    const genre = `${selectedGenre}.${extendedGenre}`

    try {
      console.log('게시물 작성 시도:', {
        title,
        description,
        author: session.user.name,
        genre,
      })

      const result = await createTopic(
        title,
        description,
        session.user.name,
        genre
      )

      console.log('생성된 게시물:', result)
      router.push('/RecommendPage')
      router.refresh()
    } catch (error) {
      console.error('게시물 작성 중 오류:', error)
      alert('게시물 작성 중 오류가 발생했습니다.')
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <h1 className="text-2xl ml-2">도서 추천하기</h1>
      <input
        type="text"
        className="border border-sky-500 p-4"
        placeholder="제목"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
      />
      <textarea
        className="border border-sky-500 p-4 h-32"
        placeholder="내용"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        required
      />

      <div className="flex gap-4">
        <select
          className="border border-sky-500 p-2 rounded"
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value)
            setExtendedGenre('') // 새로운 대분류 선택 시 초기화
          }}
          required
        >
          <option value="">대분류 선택</option>
          {Object.keys(genreHierarchy).map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          className="border border-sky-500 p-2 rounded"
          value={extendedGenre}
          onChange={(e) => setExtendedGenre(e.target.value)}
          required
          disabled={!selectedGenre}
        >
          <option value="">소분류 선택</option>
          {selectedGenre &&
            genreHierarchy[selectedGenre as keyof typeof genreHierarchy].map(
              (subGenre: string) => (
                <option key={subGenre} value={subGenre}>
                  {subGenre}
                </option>
              )
            )}
        </select>
      </div>

      <button
        className="bg-sky-300 text-sky-100 font-bold px-6 py-3 w-fit rounded-md hover:bg-sky-500"
        type="submit"
      >
        완료
      </button>
    </form>
  )
}
