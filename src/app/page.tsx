'use client'
import { useState, useEffect } from 'react'
import { getAllData } from '@/actions/dataActions'
import { getAllTopics } from '@/actions/topicActions'
import { getAllCommu } from '@/actions/commuActions'
import { getAllQanda } from '@/actions/qandaActions'
import DatasSimple from '@/components/DataSimple'
import TopicsSimple from '@/components/TopicSimple'
import Link from 'next/link'
import CommuSimple from '@/components/CommuSimple'
import QandaSimple from '@/components/QandaSimple'
import LoginForm from '@/components/LoginForm'
import RecommendedBooks from '@/components/RecommendedBooks'

// Type 정의
type Topic = {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

type Data = {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

type Commu = {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

type Qanda = {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]) // Topic 배열로 타입 지정
  const [datas, setDatas] = useState<Data[]>([]) // Data 배열로 타입 지정
  const [commus, setCommus] = useState<Commu[]>([])
  const [qandas, setQandas] = useState<Qanda[]>([])
  const [activeTab, setActiveTab] = useState('bookRecommend')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsResponse = await getAllTopics()
        const datasResponse = await getAllData()
        const commusResponse = await getAllCommu()
        const qandasResponse = await getAllQanda()
        setTopics(topicsResponse.topics) // topic 상태 업데이트
        setDatas(datasResponse.datas) // data 상태 업데이트
        setCommus(commusResponse.commus)
        setQandas(qandasResponse.qandas)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, []) // 빈 배열을 넣어서 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  return (
    <div className="flex flex-col lg:flex-row justify-between bg-sky-100 min-h-screen">
      <div className="w-full lg:w-1/4 bg-sky-200 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
        <div className="py-4 bg-sky-300">
          <LoginForm />
        </div>
        <RecommendedBooks />
      </div>
      <div className="w-full lg:w-3/4 bg-sky-50 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-sky-800">도서관 게시판</h1>
        <p className="mb-6 text-sky-600">
          이 웹사이트는 세종글꽃체를 사용하여 작성되었습니다!
        </p>

        {/* 메뉴바 */}
        <div className="mb-8 flex space-x-4 border-b">
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === 'bookRecommend'
                ? 'text-sky-700 border-b-2 border-sky-700'
                : 'text-sky-400'
            }`}
            onClick={() => setActiveTab('bookRecommend')}
          >
            도서 추천 게시판
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === 'requestedBooks'
                ? 'text-sky-700 border-b-2 border-sky-700'
                : 'text-sky-400'
            }`}
            onClick={() => setActiveTab('requestedBooks')}
          >
            도서 신청 게시판
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === 'communication'
                ? 'text-sky-700 border-b-2 border-sky-700'
                : 'text-sky-400'
            }`}
            onClick={() => setActiveTab('communication')}
          >
            자유 게시판
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === 'qanda'
                ? 'text-sky-700 border-b-2 border-sky-700'
                : 'text-sky-400'
            }`}
            onClick={() => setActiveTab('qanda')}
          >
            Q&A
          </button>
        </div>

        {/* 각 탭에 해당하는 콘텐츠 */}
        {activeTab === 'bookRecommend' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <Link
                href="/RecommendPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                도서 추천 게시판
              </Link>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addTopic"
              >
                글쓰기
              </Link>
            </div>
            <TopicsSimple topics={topics} />
          </div>
        )}

        {activeTab === 'requestedBooks' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <Link
                href="/RequestPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                도서 신청 게시판
              </Link>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addData"
              >
                글쓰기
              </Link>
            </div>
            <DatasSimple datas={datas} />
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <Link
                href="/CommunicationPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                자유 게시판
              </Link>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addCommu"
              >
                글쓰기
              </Link>
            </div>
            <CommuSimple commus={commus} />
          </div>
        )}

        {activeTab === 'qanda' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <Link
                href="/QandAPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                Q&A
              </Link>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addQanda"
              >
                글쓰기
              </Link>
            </div>
            <QandaSimple qandas={qandas} />
          </div>
        )}
      </div>
    </div>
  )
}
