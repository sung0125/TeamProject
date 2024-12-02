import { getAllData } from '@/actions/dataActions'
import { getAllTopics } from '@/actions/topicActions'
import DatasSimple from '@/components/DataSimple'
import TopicsSimple from '@/components/TopicSimple'
import Link from 'next/link'

export default async function Home() {
  const { topics } = await getAllTopics()
  const { datas } = await getAllData()
  return (
    <div>
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-sky-800">
            도서관 게시판
          </h1>
          <p className="mb-6 text-sky-600">
            이 웹사이트는 세종글꽃체를 사용하여 작성되었습니다!
          </p>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <a
                href="/LibraryPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                게시판 1
              </a>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addTopic"
              >
                글쓰기
              </Link>
            </div>
            <TopicsSimple topics={topics} />
          </div>
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <a
                href="/RecommendPage"
                className="text-xl font-semibold p-1 text-sky-700 hover:text-sky-300"
              >
                게시판 2
              </a>
              <Link
                className="bg-sky-300 text-lg p-1 font-bold rounded-md hover:bg-sky-400"
                href="/addData"
              >
                글쓰기
              </Link>
            </div>
            <DatasSimple datas={datas} />
          </div>
        </div>
      </div>
    </div>
  )
}
