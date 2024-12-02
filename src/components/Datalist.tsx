'use client'
//import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import RemoveBtn_Data from './RemoveBtn_Data'

interface Data {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}
interface datasListProps {
  datas: Data[]
}
export default function DatasList({ datas }: datasListProps) {
  return (
    <div>
      {datas.map((data) => (
        <div
          key={data._id}
          className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <div>{data.description}</div>
            <div className="flex gap-4">
              <p>Created: {new Date(data.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <RemoveBtn_Data id={data._id} />
            <Link href={`/editData/${data._id}`}>
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

// export default function datasList() {
//   const [datas, setdatas] = useState<data[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   useEffect(() => {
//     async function fetchdatas() {
//       try {
//         const res = await fetch('/api/datas')
//         if (!res.ok) {
//           throw new Error('Failed to fetch datas')
//         }
//         const data = await res.json()
//         setdatas(data.datas)
//       } catch (error) {
//         console.error('Error loading datas: ', error)
//         setError('Failed to load datas')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchdatas()
//   }, [])
//   if (loading) return <p className="text-2xl">토 픽 로 딩 중 . . .</p>
//   if (error) return <p>Error: {error}</p>
//   if (datas.length === 0) return <p>토픽을 찾지 못했습니다.</p>
//   return (
//     <>
//       {datas.map((data: data) => (
//         <div
//           key={data._id}
//           className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start"
//         >
//           <div>
//             <h2 className="text-2xl font-bold">{data.title}</h2>
//             <div>{data.description}</div>
//             <div className="flex gap-4">
//               <p>생성일자: {data.createdAt} </p>
//               <p>수정일자: {data.updatedAt} </p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <RemoveBtn id={data._id} />
//             <Link href={`/editdata/${data._id}`}>
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
//         <h2 className="text-2xl font-bold">data Title</h2>
//         <div>data description</div>
//       </div>

//       <div className="flex gap-2">
//         <RemoveBtn />
//         <Link href={'/editdata/123'}>
//           <HiPencilAlt
//             className="text-sky-500 hover:text-sky-800"
//             size={24}
//           />
//         </Link>
//       </div>
//     </div>
//   </>
// )
