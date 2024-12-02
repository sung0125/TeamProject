import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/Navbar'
import { NextAuthProvider } from '@/components/Providers'
import LoginForm from '@/components/LoginForm'
import SearchBar from '@/components/SearchBar'

const geistSans = localFont({
  src: './fonts/SejongGeulggot.ttf',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/SejongGeulggot.ttf',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '중부도서관',
  description: 'Create, Read, Update, and Delete in MongoDB',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-mono)]`}
      >
        <NextAuthProvider>
          <div className="">
            <Navbar />
            <SearchBar />
            <div className="flex flex-col lg:flex-row justify-between bg-sky-100 min-h-screen p-6">
              <div className="w-full lg:w-1/4 bg-sky-200 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  User Login
                </h2>
                <LoginForm />
                <div className="mt-6 bg-sky-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-2 text-sky-700 text-center">
                    추천 도서
                  </h2>
                  <ul className="list-disc list-inside text-sky-600">
                    <li>도서 1</li>
                    <li>도서 2</li>
                    <li>도서 3</li>
                  </ul>
                </div>
              </div>
              <div className="w-full lg:w-3/4 bg-sky-50 p-6 rounded-lg shadow-md">
                {children}
              </div>
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
