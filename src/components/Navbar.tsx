'use client'
import Link from 'next/link'
import LoginForm from './LoginForm'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-sky-300 px-8 py-4">
      <Link
        className="text-sky-100 text-4xl font-extrabold hover:text-sky-400"
        href="/"
      >
        중부도서관
      </Link>
      <div className="flex">
        <LoginForm />
      </div>
    </nav>
  )
}
