import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/Navbar'
import { NextAuthProvider } from '@/components/Providers'
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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <SearchBar />
            <div className="bg-sky-100 flex-grow p-6">{children}</div>
            <footer className="bg-sky-900 text-white p-2">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-8">
                    <div className="text-sm">
                      <h3 className="text-base font-semibold mb-1">
                        중부도서관
                      </h3>
                      <p>경기도 고양시 덕양구 대자동 동헌로 305</p>
                      <p>전화: 031-8075-1090~92 </p>
                    </div>
                    <div className="text-sm">
                      <h3 className="text-base font-semibold mb-1">이용시간</h3>
                      <p>하절기: 09:00 - 18:00</p>
                      <p>동절기: 09:00 - 17:00</p>
                    </div>
                    <div className="text-sm">
                      <h3 className="text-base font-semibold mb-1">SNS</h3>
                      <div className="flex space-x-4">
                        <a href="/teampage" className="hover:text-gray-300">
                          팀페이지
                        </a>
                        <a
                          href="https://github.com/Hoodscp/2024_2_Team_Library"
                          className="hover:text-gray-300"
                        >
                          깃허브
                        </a>
                        <a
                          href="https://julis.joongbu.ac.kr/"
                          className="hover:text-gray-300"
                        >
                          중부대학교
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm self-center">
                    <p>© 2024 중부도서관. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
