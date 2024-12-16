'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Book = {
  title: string
  author: string
  publisher: string
  pubDate: string
  cover?: string
  link: string
  isbn: string
}

type ResultState = null | { error: string } | Book[]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [results, setResults] = useState<ResultState>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  )
  const itemsPerPage = 10

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/aladin?query=${query}`)
        const data = await response.json()
        setResults(Array.isArray(data) ? data : data.items || [])
      } catch {
        setResults({ error: '검색 결과를 가져오는데 실패했습니다' })
      } finally {
        setLoading(false)
      }
    }

    if (query.trim()) {
      fetchResults()
    }
  }, [query])

  const handleCheckboxChange = (key: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getTotalPages = () => {
    if (!results || !Array.isArray(results)) return 0
    return Math.ceil(results.length / itemsPerPage)
  }

  const getCurrentItems = () => {
    if (!results || !Array.isArray(results)) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    return results.slice(startIndex, startIndex + itemsPerPage)
  }

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-black">검색 결과</h1>
      {loading ? (
        <p className="text-sky-600">검색 중...</p>
      ) : results && Array.isArray(results) && results.length > 0 ? (
        <>
          <div className="space-y-4">
            {getCurrentItems().map((book, index) => (
              <div
                key={`${book.isbn}-${index}`}
                className="relative flex gap-4 p-4 border rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={checkedState[`${book.isbn}-${index}`] || false}
                  onChange={() => handleCheckboxChange(`${book.isbn}-${index}`)}
                  className="absolute top-4 right-4 w-4 h-4 cursor-pointer z-10"
                />
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-24 h-32 object-cover"
                  />
                )}
                <div className="flex flex-col justify-between">
                  <div>
                    <Link href={`/book/${book.isbn}`}>
                      <h2
                        onClick={async () => {
                          try {
                            // 상세 정보 가져오기
                            const response = await fetch(
                              `/api/aladin/detail?isbn=${book.isbn}`
                            )
                            const detailData = await response.json()

                            const bookData = {
                              title: book.title,
                              author: book.author,
                              publisher: book.publisher,
                              pubDate: book.pubDate,
                              cover: book.cover,
                              description: detailData.item[0].description || '',
                              pages: detailData.item[0].subInfo.itemPage || '',
                              toc: detailData.item[0].toc || '',
                              link: book.link,
                              isbn: book.isbn,
                            }

                            sessionStorage.setItem(
                              'selectedBook',
                              JSON.stringify(bookData)
                            )
                            window.location.href = `/book/${book.isbn}`
                          } catch (error) {
                            console.error('상세 정보 가져오기 실패:', error)
                            // 기본 정보만이라도 저장
                            const bookData = {
                              title: book.title,
                              author: book.author,
                              publisher: book.publisher,
                              pubDate: book.pubDate,
                              cover: book.cover,
                              description: '',
                              pages: '',
                              toc: '',
                              link: book.link,
                              isbn: book.isbn,
                            }
                            sessionStorage.setItem(
                              'selectedBook',
                              JSON.stringify(bookData)
                            )
                            window.location.href = `/book/${book.isbn}`
                          }
                        }}
                        className="text-lg font-semibold hover:text-blue-600 cursor-pointer"
                      >
                        {book.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600">{book.author}</p>
                    <p className="text-gray-500">
                      {book.publisher} | {book.pubDate}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(book.link, '_blank')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded w-fit hover:bg-gray-200"
                  >
                    Aladin 정보보기
                  </button>
                </div>
              </div>
            ))}
          </div>
          {getTotalPages() > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-4 py-2">
                {currentPage} / {getTotalPages()}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, getTotalPages()))
                }
                disabled={currentPage === getTotalPages()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-sky-600">검색 결과가 없습니다.</p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SearchContent />
    </Suspense>
  )
}
