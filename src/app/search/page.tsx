'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// 결과 상태 타입 정의
type ResultState = null | { error: string } | Record<string, any>

// 검색 결과 컴포넌트 분리
function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || '' // URL에서 query 매개변수 가져오기
  const [results, setResults] = useState<ResultState>(null) // 초기 상태는 null
  const [loading, setLoading] = useState(false) // 로딩 상태 관리

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true) // 로딩 시작
      try {
        const response = await fetch(`/api/aladin?query=${query}`)
        const data = await response.json()
        setResults(data) // API 응답 데이터 저장
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching search results:', error.message)
        } else {
          console.error('Unexpected error:', error)
        }
        setResults({ error: 'Failed to fetch results' }) // 오류 상태 저장
      } finally {
        setLoading(false) // 로딩 종료
      }
    }

    if (query.trim()) {
      fetchResults() // 검색어가 있을 때만 API 호출
    }
  }, [query])

  if (loading) {
    return <p className="text-sky-600">검색 중...</p>
  }

  if (results) {
    return (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-black">
        {JSON.stringify(results, null, 2)}
      </pre>
    )
  }

  return <p className="text-sky-600">검색 결과가 없습니다.</p>
}

export default function SearchPage() {
  return (
    <div className="p-6 bg-sky-100">
      <h1 className="text-2xl font-bold mb-4 text-black">검색 결과</h1>
      <Suspense fallback={<p className="text-sky-600">로딩 중...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
