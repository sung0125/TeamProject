'use client'
import { updateTopic } from '@/actions/topicActions'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface EditTopicFormProps {
  id: string
  initialTitle: string
  initialDescription: string
  initialGenre: string
}

export default function EditTopicForm({
  id,
  initialTitle,
  initialDescription,
  initialGenre,
}: EditTopicFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [selectedMainGenre, setSelectedMainGenre] = useState(
    initialGenre ? initialGenre.split('.')[0] : ''
  )
  const [selectedSubGenre, setSelectedSubGenre] = useState(
    initialGenre ? initialGenre.split('.')[1] : ''
  )

  const router = useRouter()

  // 장르 계층 구조
  const genreHierarchy = {
    소설: ['로맨스', '판타지', '추리'],
    비소설: ['자서전', '역사', '에세이'],
    과학: ['물리', '생물', '천문학'],
    기술: ['프로그래밍', '데이터', '보안'],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMainGenre || !selectedSubGenre) {
      alert('장르를 선택해주세요.')
      return
    }

    const genre = `${selectedMainGenre}.${selectedSubGenre}`

    try {
      await updateTopic(id, title, description, genre)
      router.push(`/RecommendPage/${id}`)
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      className="max-w-4xl mx-auto flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl">게시물 수정</h1>
      <input
        type="text"
        className="border border-sky-800 p-4"
        placeholder="Topic Title"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
      />
      <textarea
        className="border border-sky-800 p-4 h-32"
        placeholder="Topic Description"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        value={description}
      />

      {/* 장르 선택 부분 */}
      <div className="flex gap-4">
        <select
          className="border border-sky-800 p-2 rounded"
          value={selectedMainGenre}
          onChange={(e) => {
            setSelectedMainGenre(e.target.value)
            setSelectedSubGenre('') // 대분류가 변경되면 소분류 초기화
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
          className="border border-sky-800 p-2 rounded"
          value={selectedSubGenre}
          onChange={(e) => setSelectedSubGenre(e.target.value)}
          required
          disabled={!selectedMainGenre}
        >
          <option value="">소분류 선택</option>
          {selectedMainGenre &&
            genreHierarchy[selectedMainGenre as keyof typeof genreHierarchy].map(
              (subGenre) => (
                <option key={subGenre} value={subGenre}>
                  {subGenre}
                </option>
              )
            )}
        </select>
      </div>

      <button
        className="bg-sky-700 text-sky-400 font-bold px-6 py-3 w-fit rounded-md hover:bg-sky-900"
        type="submit"
      >
        완료
      </button>
    </form>
  )
}
