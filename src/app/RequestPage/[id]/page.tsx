"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDataById } from "@/actions/dataActions";
import Link from "next/link";
import { HiOutlinePencil } from "react-icons/hi";
import Comment from "@/components/comment";
import RemoveBtn_Data from "@/components/RemoveBtn_Data";

type Data = {
  _id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default function DataDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataById(id);
        if (response.success) {
          setData(response.data);
        } else {
          setError("데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto mt-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto mt-8 text-red-600">{error}</div>;
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto mt-8">게시글을 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        {/* 왼쪽 링크 */}
        <Link href="/RequestPage" className="text-sky-600 hover:text-sky-800">
          ← 목록으로 돌아가기
        </Link>

        <div className="flex gap-2">
          <Link
            href={`/editData/${id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            <HiOutlinePencil size={24} />
          </Link>
          <RemoveBtn_Data id={data._id} />
        </div>
      </div>

      {/* 제목과 작성자 정보 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">작성자:</span>
            <span>{data.author || "작성자 정보 없음"}</span>
          </div>
          <div className="text-right">
            <p>작성일: {new Date(data.createdAt).toLocaleString()}</p>
            {data.updatedAt !== data.createdAt && (
              <p>수정일: {new Date(data.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* 본문 내용 */}
      <div className="prose max-w-none mb-8">
        <p className="text-gray-700 whitespace-pre-wrap">{data.description}</p>
      </div>

      {/* 댓글 섹션 */}
      <Comment postId={id} postType={"data"} />
    </div>
  );
}
