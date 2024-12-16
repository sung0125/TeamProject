"use client";

interface Topic {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TopicsListProps {
  topics: Topic[];
}

export default function TopicsSimple({ topics }: TopicsListProps) {
  // 최신순으로 정렬 후 상위 3개 추출
  const recentTopics = topics
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div>
      {recentTopics.map((topic) => (
        <div
          key={topic._id}
          className="p-3 bg-sky-200 border border-slate-300 my-1 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="font-bold">{topic.title}</h2>
          </div>
          <div className="flex gap-2">
            <p>{new Date(topic.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
