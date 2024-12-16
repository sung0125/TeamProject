import connectMongoDB from '@/libs/mongodb'
import Log from '@/models/log'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    await connectMongoDB()
    await Log.create({ email })
    return NextResponse.json({ message: 'Login event logged' }, { status: 201 })
  } catch (error) {
    console.error(
      'Error logging login event:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json(
      { message: 'Error logging login event' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    console.log('Received email:', email)

    await connectMongoDB()
    console.log('MongoDB connected')

    const user = await User.findOne({ email })
    console.log('User found:', user)

    const logs = await Log.find({ email }).sort({ createdAt: -1 }).limit(10)
    console.log('Logs found:', logs)

    return NextResponse.json({ user, logs }, { status: 200 })
  } catch (error) {
    console.error(
      'Error fetching user data:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json(
      {
        message: 'Error fetching user data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
