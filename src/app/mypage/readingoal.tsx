import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import axios from 'axios'

type ReadingData = {
  booksRead: number
  pagesRead: number
  readingGoal: number
  monthlyStats: { [key: string]: number }
  readingDays: string[]
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const ReadingGoal: React.FC = () => {
  const [readingData, setReadingData] = useState<ReadingData>({
    booksRead: 0,
    pagesRead: 0,
    readingGoal: 5,
    monthlyStats: {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    },
    readingDays: [],
  })

  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [lastClickTime, setLastClickTime] = useState(0)
  const [saveStatus, setSaveStatus] = useState<string>('')

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        const response = await axios.get('/api/readingdata')
        if (response.data && response.data.data) {
          setReadingData(response.data.data)
          setSaveStatus('데이터를 불러왔습니다.')
        }
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } } }
        console.error('데이터 불러오기 오류:', error)
        setSaveStatus(
          error.response?.data?.error || '데이터를 불러오는데 실패했습니다.'
        )
      } finally {
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }

    fetchReadingData()
  }, [])

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/readingdata', readingData)
      if (response.data && response.data.data) {
        setReadingData(response.data.data)
        setSaveStatus('성공적으로 저장되었습니다!')
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } }
      console.error('데이터 저장 오류:', error)
      setSaveStatus(error.response?.data?.error || '저장에 실패했습니다.')
    } finally {
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleDateClick = (value: Date) => {
    const now = new Date().getTime()
    const timeSinceLastClick = now - lastClickTime

    if (timeSinceLastClick < 300) {
      handleDateDoubleClick(value)
    } else {
      const dateString = value.toDateString()
      const monthKey = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(value)

      setReadingData((prev) => {
        const isAlreadyRead = prev.readingDays.includes(dateString)

        if (!isAlreadyRead) {
          return {
            ...prev,
            booksRead: prev.booksRead + 1,
            pagesRead: prev.pagesRead + 250,
            monthlyStats: {
              ...prev.monthlyStats,
              [monthKey]: (prev.monthlyStats[monthKey] || 0) + 1,
            },
            readingDays: [...prev.readingDays, dateString],
          }
        }
        return prev
      })
    }

    setLastClickTime(now)
    setSelectedDate(value)
  }

  const handleDateDoubleClick = (value: Date) => {
    const dateString = value.toDateString()
    const monthKey = new Intl.DateTimeFormat('en-US', {
      month: 'short',
    }).format(value)

    setReadingData((prev) => {
      const isAlreadyRead = prev.readingDays.includes(dateString)

      if (isAlreadyRead) {
        return {
          ...prev,
          booksRead: Math.max(0, prev.booksRead - 1),
          pagesRead: Math.max(0, prev.pagesRead - 250),
          monthlyStats: {
            ...prev.monthlyStats,
            [monthKey]: Math.max(0, (prev.monthlyStats[monthKey] || 0) - 1),
          },
          readingDays: prev.readingDays.filter((day) => day !== dateString),
        }
      }
      return prev
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">독서 목표 및 통계</h2>
        <div>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            저장하기
          </button>
          {saveStatus && (
            <span
              className={`ml-4 ${
                saveStatus.includes('실패') ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {saveStatus}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">연간 독서 목표</h3>
        <select
          value={readingData.readingGoal}
          onChange={(e) =>
            setReadingData((prev) => ({
              ...prev,
              readingGoal: Number(e.target.value),
            }))
          }
          className="border rounded p-2 w-full"
        >
          {Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map((goal) => (
            <option key={goal} value={goal}>
              {goal} 권
            </option>
          ))}
        </select>
        <div className="flex items-center mt-4">
          <div className="w-64 h-6 bg-gray-200 rounded-full">
            <div
              className="h-6 bg-blue-500 rounded-full"
              style={{
                width: `${
                  (readingData.booksRead / readingData.readingGoal) * 100
                }%`,
              }}
            ></div>
          </div>
          <span className="ml-4">
            {readingData.booksRead} / {readingData.readingGoal} 권
          </span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">독서 통계</h3>
        <label className="block mb-2">읽은 책:</label>
        <input
          type="number"
          value={readingData.booksRead}
          onChange={(e) =>
            setReadingData((prev) => ({
              ...prev,
              booksRead: Math.max(0, Number(e.target.value)),
            }))
          }
          min="0"
          className="border rounded p-2 w-full"
        />

        <label className="block mb-2 mt-4">읽은 페이지:</label>
        <input
          type="number"
          value={readingData.pagesRead}
          onChange={(e) =>
            setReadingData((prev) => ({
              ...prev,
              pagesRead: Math.max(0, Number(e.target.value)),
            }))
          }
          min="0"
          className="border rounded p-2 w-full"
        />

        <h4 className="text-lg font-semibold mt-4 mb-2">월별 독서량</h4>
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(readingData.monthlyStats).map(([month, count]) => (
            <div key={month} className="text-center">
              <div className="font-semibold">{month}</div>
              <div>{count} 권</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">독서 캘린더</h3>
        <Calendar
          value={selectedDate}
          tileContent={({ date }) => {
            const dateString = date.toDateString()
            return readingData.readingDays.includes(dateString) ? (
              <span className="text-red-500">📖</span>
            ) : null
          }}
          onClickDay={handleDateClick}
        />
      </div>
    </div>
  )
}

export default ReadingGoal
