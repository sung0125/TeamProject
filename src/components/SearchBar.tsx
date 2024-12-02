'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchBarRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (!query.trim()) {
      alert('검색어를 입력하세요')
      return
    }
    setIsSearching(true)
    router.push(`/search?query=${encodeURIComponent(query)}`)
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.blur() // 커서 깜빡임 방지
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() && !isSearching) {
        try {
          const response = await fetch(
            `/api/aladin?query=${encodeURIComponent(query)}`
          )
          const data = await response.json()

          if (data && data.item) {
            const bookTitles = data.item.map(
              (book: { title: string }) => book.title
            )
            setSuggestions(bookTitles)
          } else {
            setSuggestions([])
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          setSuggestions([])
        }
      } else {
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [query, isSearching])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // 새 페이지로 이동할 때 검색어와 제안을 초기화합니다
    if (!pathname.startsWith('/search')) {
      setQuery('')
      setSuggestions([])
      setIsSearching(false)
    }
  }, [pathname])

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="text-blue-500 font-bold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  return (
    <div
      ref={searchBarRef}
      className="relative flex justify-center items-center pt-4 bg-sky-100"
    >
      <div className="w-2/3">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsSearching(false)
            }}
            onKeyDown={handleKeyPress}
            placeholder="도서를 검색하세요"
            className="w-full p-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-black"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600"
          >
            <FaSearch size={20} />
          </button>
        </div>

        {suggestions.length > 0 && !isSearching && (
          <ul className="absolute w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-10 mt-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setQuery(suggestion)
                  setSuggestions([])
                  setIsSearching(true)
                  router.push(`/search?query=${encodeURIComponent(suggestion)}`)
                }}
                className="p-2 hover:bg-sky-100 cursor-pointer"
              >
                {highlightMatch(suggestion, query)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SearchBar
