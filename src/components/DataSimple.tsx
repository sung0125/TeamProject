'use client'
interface Data {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

interface DatasListProps {
  datas: Data[]
}

export default function DatasSimple({ datas }: DatasListProps) {
  // 최신순으로 정렬 후 상위 3개 추출
  const recentTopics = datas
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3)

  return (
    <div>
      {recentTopics.map((data) => (
        <div
          key={data._id}
          className="p-3 bg-sky-200 border border-slate-300 my-1 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="font-bold">{data.title}</h2>
          </div>
          <div className="flex gap-2">
            <p>{new Date(data.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
