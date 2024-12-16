import React from 'react'

type UserProfileProps = {
  user: {
    _id: string
    email: string
    createdAt?: string
    name?: string
    lastLogin?: string | null
    profileImage?: string
  } | null
  logs: { lastAccessed: string }[]
}

const Profile: React.FC<UserProfileProps> = ({ user, logs }) => {
  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0] // YYYY-MM-DD 형식
  }

  // 최근 4개의 로그를 가져오는 함수
  const getRecentLogs = () => {
    const today = new Date()

    // 오늘 날짜의 현재 시간 로그 추가
    const logsWithToday = [{ lastAccessed: today.toISOString() }, ...logs]

    // 로그를 날짜별로 그룹화
    const groupedLogs = logsWithToday.reduce((acc, log) => {
      const date = getDateString(new Date(log.lastAccessed))
      if (
        !acc[date] ||
        new Date(log.lastAccessed) > new Date(acc[date].lastAccessed)
      ) {
        acc[date] = log
      }
      return acc
    }, {} as Record<string, { lastAccessed: string }>)

    // 그룹화된 로그를 배열로 변환하고 날짜 기준 내림차순 정렬
    return Object.values(groupedLogs)
      .sort(
        (a, b) =>
          new Date(b.lastAccessed).getTime() -
          new Date(a.lastAccessed).getTime()
      )
      .slice(0, 4)
  }

  const recentLogs = getRecentLogs()

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">프로필</h2>

      <div className="space-y-2">
        {user && (
          <>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>
            {user.createdAt && (
              <p>
                <strong>가입일:</strong>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
            {user.lastLogin && (
              <p>
                <strong>최근 접속:</strong>{' '}
                {new Date(user.lastLogin).toLocaleString()}
              </p>
            )}
          </>
        )}

        {/* 최근 접속 기록 표시 (최대 4개) */}
        <h3 className="mt-4 font-semibold">최근 접속 기록</h3>
        <ul>
          {recentLogs.length > 0 ? (
            recentLogs.map((log, index) => (
              <li key={index}>{new Date(log.lastAccessed).toLocaleString()}</li>
            ))
          ) : (
            <li>접속 기록이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Profile
