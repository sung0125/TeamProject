'use client'
//import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import RemoveBtn from './RemoveBtn'

interface Topic {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}
interface TopicsListProps {
  topics: Topic[]
}
export default function TopicsList({ topics }: TopicsListProps) {
  return (
    <div>
      {topics.map((topic) => (
        <div
          key={topic._id}
          className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="text-2xl font-bold">{topic.title}</h2>
            <div>{topic.description}</div>
            <div className="flex gap-4">
              <p>Created: {new Date(topic.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(topic.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <RemoveBtn id={topic._id} />
            <Link href={`/editTopic/${topic._id}`}>
              <HiPencilAlt
                size={24}
                className="text-sky-500 hover:text-sky-800"
              />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

// export default function TopicsList() {
//   const [topics, setTopics] = useState<Topic[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   useEffect(() => {
//     async function fetchTopics() {
//       try {
//         const res = await fetch('/api/topics')
//         if (!res.ok) {
//           throw new Error('Failed to fetch topics')
//         }
//         const data = await res.json()
//         setTopics(data.topics)
//       } catch (error) {
//         console.error('Error loading topics: ', error)
//         setError('Failed to load topics')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchTopics()
//   }, [])
//   if (loading) return <p className="text-2xl">토 픽 로 딩 중 . . .</p>
//   if (error) return <p>Error: {error}</p>
//   if (topics.length === 0) return <p>토픽을 찾지 못했습니다.</p>
//   return (
//     <>
//       {topics.map((topic: Topic) => (
//         <div
//           key={topic._id}
//           className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start"
//         >
//           <div>
//             <h2 className="text-2xl font-bold">{topic.title}</h2>
//             <div>{topic.description}</div>
//             <div className="flex gap-4">
//               <p>생성일자: {topic.createdAt} </p>
//               <p>수정일자: {topic.updatedAt} </p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <RemoveBtn id={topic._id} />
//             <Link href={`/editTopic/${topic._id}`}>
//               <HiPencilAlt
//                 className="text-sky-500 hover:text-sky-800"
//                 size={24}
//               />
//             </Link>
//           </div>
//         </div>
//       ))}
//     </>
//   )

// return (
//   <>
//     <div className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start">
//       <div>
//         <h2 className="text-2xl font-bold">Topic Title</h2>
//         <div>Topic description</div>
//       </div>

//       <div className="flex gap-2">
//         <RemoveBtn />
//         <Link href={'/editTopic/123'}>
//           <HiPencilAlt
//             className="text-sky-500 hover:text-sky-800"
//             size={24}
//           />
//         </Link>
//       </div>
//     </div>
//   </>
// )
