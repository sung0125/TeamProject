'use client'

import { useState, useEffect } from 'react'

type BookDetail = {
  title: string
  author: string
  publisher: string
  pubDate: string
  cover: string
  description: string
  pages: string
  toc: string
  link: string
}

export default function BookDetailPage() {
  const [book, setBook] = useState<BookDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const bookData = sessionStorage.getItem('selectedBook')

      if (!bookData) {
        setError('책 정보를 찾을 수 없습니다.')
        setLoading(false)
        return
      }

      const parsedBook = JSON.parse(bookData)
      setBook(parsedBook)
      setLoading(false)
    } catch (error) {
      console.error('데이터 처리 오류:', error)
      setError('책 정보를 불러오는데 실패했습니다.')
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="p-6">로딩 중...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!book) return <div className="p-6">책을 찾을 수 없습니다.</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">저자:</span> {book.author}
            </p>
            <p>
              <span className="font-semibold">출판사:</span> {book.publisher}
            </p>
            <p>
              <span className="font-semibold">출판일:</span> {book.pubDate}
            </p>
            <p>
              <span className="font-semibold">페이지:</span> {book.pages}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">책 소개</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {book.description}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">목차</h2>
          <p className="text-gray-700 whitespace-pre-line">{book.toc}</p>
        </section>
      </div>
    </div>
  )
}
