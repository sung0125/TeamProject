// src/app/api/readingdata/route.ts
import { NextResponse } from 'next/server'
import ReadingData from '@/models/readingdata'
import Log from '@/models/log'
import connectMongoDB from '@/libs/mongodb'

// 에러 타입 정의
interface CustomError extends Error {
  message: string
}

// 현재 로그인한 사용자의 이메일 가져오기
async function getCurrentUserEmail() {
  const latestLog = await Log.findOne().sort({ createdAt: -1 })
  if (!latestLog || !latestLog.email) {
    throw new Error('로그인이 필요합니다.')
  }
  return latestLog.email
}

export async function GET() {
  try {
    await connectMongoDB()

    // 현재 로그인한 사용자의 이메일 가져오기
    const email = await getCurrentUserEmail()

    // 해당 이메일의 독서 데이터 찾기
    let userData = await ReadingData.findOne({ email })

    // 데이터가 없으면 새로운 데이터 생성
    if (!userData) {
      userData = await ReadingData.create({
        email,
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
    }

    return NextResponse.json({
      message: '데이터를 성공적으로 불러왔습니다.',
      data: userData,
    })
  } catch (error) {
    const customError = error as CustomError
    console.error('GET 요청 오류:', customError)
    return NextResponse.json(
      { error: customError.message || '데이터를 가져오는데 실패했습니다.' },
      { status: customError.message.includes('로그인') ? 401 : 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB()

    // 현재 로그인한 사용자의 이메일 가져오기
    const email = await getCurrentUserEmail()
    const data = await request.json()

    // 해당 이메일의 데이터 업데이트
    const updatedData = await ReadingData.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          booksRead: data.booksRead,
          pagesRead: data.pagesRead,
          readingGoal: data.readingGoal,
          monthlyStats: data.monthlyStats,
          readingDays: data.readingDays,
        },
      },
      {
        new: true, // 업데이트된 데이터 반환
        upsert: true, // 없으면 새로 생성
        setDefaultsOnInsert: true,
      }
    )

    return NextResponse.json({
      message: '성공적으로 저장되었습니다.',
      data: updatedData,
    })
  } catch (error) {
    const customError = error as CustomError
    console.error('POST 요청 오류:', customError)
    return NextResponse.json(
      { error: customError.message || '데이터 저장에 실패했습니다.' },
      { status: customError.message.includes('로그인') ? 401 : 500 }
    )
  }
}
