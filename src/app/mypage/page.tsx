'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { FaUser, FaHeart, FaStar, FaBookOpen } from 'react-icons/fa'
import Profile from './profile'
import BookList from './booklist'
import ReadingGoal from './readingoal'
import { Session } from 'next-auth'

type User = {
  _id: string
  email: string
  createdAt?: string
  name?: string
  lastLogin?: string | null
  readCount?: number
  profileImage?: string
}

type Log = {
  createdAt: string
}

type CustomSession = Session & {
  logs?: { lastAccessed: string }[]
}

export default function MyPage() {
  const { data: session, status } = useSession() as {
    data: CustomSession | null
    status: string
  }

  const [activeSection, setActiveSection] = useState<string>('profile')
  const [userData, setUserData] = useState<{
    user: User | null
    logs: Log[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch(`/api/log?email=${session.user.email}`)
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }
      const data = await response.json()

      const today = new Date().toISOString().split('T')[0]

      const filteredLogs = data.logs.filter((log: Log) => {
        if (!log || !log.createdAt) return false

        const logDate = new Date(log.createdAt)
        return (
          !isNaN(logDate.getTime()) &&
          logDate.toISOString().split('T')[0] <= today
        )
      })

      setUserData({
        user: data.user || null,
        logs: filteredLogs,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching user data:', error.message)
        setError('Failed to load user data. Please try again later.')
      } else {
        console.error('An unknown error occurred', error)
        setError('An unexpected error occurred.')
      }
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const loadData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          await fetchUserData()
        } catch (error) {
          console.error('Error loading data:', error)
          setError('Failed to load data. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
      loadData()
    }
  }, [status, session, fetchUserData])

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return userData ? (
          <Profile
            user={userData.user}
            logs={userData.logs.map((log) => ({ lastAccessed: log.createdAt }))}
          />
        ) : null
      case 'favorites':
        return <BookList books={[]} title="찜 목록" />
      case 'wishlist':
        return <BookList books={[]} title="즐겨찾기 목록" />
      case 'reading-goal':
        return <ReadingGoal />
      default:
        return null
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="text-2xl text-center mt-10">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-2xl text-center mt-10">
        Please sign in to view this page.
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-2xl text-center mt-10 text-red-500">{error}</div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FaUser size={50} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold">
            {session?.user?.email || 'User'}
          </h2>
        </div>

        <ul>
          {[
            { id: 'profile', icon: FaUser, label: '프로필' },
            { id: 'favorites', icon: FaHeart, label: '찜 목록' },
            { id: 'wishlist', icon: FaStar, label: '즐겨찾기 목록' },
            { id: 'reading-goal', icon: FaBookOpen, label: '도서 목표 스탬프' },
          ].map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`cursor-pointer flex items-center py-2 hover:bg-gray-200 rounded-md ${
                activeSection === item.id ? 'bg-gray-200' : ''
              }`}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              <item.icon className="mr-2" aria-hidden="true" /> {item.label}
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  )
}
