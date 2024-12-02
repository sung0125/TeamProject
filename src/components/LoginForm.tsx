'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function LoginForm() {
  const { status, data: session } = useSession()
  return (
    <nav className="flex justify-between items-center bg-sky-300 px-8 py-4">
      <div className="flex">
        <div className="flex">
          {status === 'authenticated' ? (
            <>
              <div className="flex gap-2 items-center mr-2">
                <Image
                  className="rounded-full"
                  src={session?.user?.image ?? '/default-avatar.png'}
                  width={40}
                  height={40}
                  alt={session?.user?.name ?? 'user'}
                />
                <a
                  href="/dashboard"
                  className="text-white font-bold hover:text-sky-200"
                >
                  {session?.user?.name}
                </a>
              </div>
              <button
                className="bg-sky-400 text-lg font-bold px-4 py-2 rounded-md hover:bg-sky-600"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              className="bg-sky-400 text-lg font-bold px-4 py-2 rounded-md hover:bg-sky-600"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
