"use client";

import { useState, useEffect } from "react";
import { getAllQanda } from "@/actions/qandaActions"; // Q&A 관련 데이터 호출 함수
import Link from "next/link";
import { FaSearch, FaPlus } from "react-icons/fa";

type Qanda = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function QandAPage() {
  const [qandas, setQandas] = useState<Qanda[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const qandasPerPage = 6;

  useEffect(() => {
    const fetchQandas = async () => {
      try {
        const response = await getAllQanda(); // Q&A 관련 데이터 호출
        setQandas(response.qandas);
      } catch (error) {
        console.error("Error fetching Q&A:", error);
      }
    };
    fetchQandas();
  }, []);

  const filteredQandas = qandas.filter((qanda) =>
    qanda.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastQanda = currentPage * qandasPerPage;
  const indexOfFirstQanda = indexOfLastQanda - qandasPerPage;
  const currentQandas = filteredQandas.slice(
    indexOfFirstQanda,
    indexOfLastQanda
  );

  const totalPages = Math.ceil(filteredQandas.length / qandasPerPage);

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col">
      {/* 상단 메뉴바 */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center bg-sky-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Q&A 게시판</h1>
          <div className="space-x-4">
            <Link href="/RecommendPage" className="hover:underline">
              도서 추천 게시판
            </Link>
            <Link href="/RequestPage" className="hover:underline">
              도서 신청 게시판
            </Link>
            <Link href="/CommunicationPage" className="hover:underline">
              자유 게시판
            </Link>
          </div>
        </div>
      </div>

      {/* 게시글 추가 버튼과 검색 바가 같은 라인에 배치 */}
      <div className="flex justify-between items-center mb-6">
        {/* 검색 바 */}
        <div className="relative flex-1 mr-4">
          <input
            type="text"
            placeholder="Q&A 게시글을 검색하세요..."
            className="w-full p-3 border rounded-lg focus:outline-sky-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-2 top-2">
            <FaSearch className="text-gray-500" />
          </button>
        </div>

        {/* 게시글 추가 버튼 (오른쪽에 위치) */}
        <Link
          href="/addQanda" // Q&A 관련 추가 페이지로 변경
          className="inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-700 rounded-full w-12 h-12"
        >
          <FaPlus className="text-lg" />
        </Link>
      </div>

      <div>
        <div>
          {currentQandas.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentQandas.map((qanda) => (
                <div
                  key={qanda._id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-lg font-bold text-sky-700 mb-2">
                    {qanda.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{qanda.description}</p>
                  <Link
                    href={`/QandAPage/${qanda._id}`} // Q&A 관련 세부 페이지로 변경
                    className="block mt-4 text-sky-500 hover:underline"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Q&A 게시글이 없습니다.</p>
          )}

          {/* 페이지 네비게이션 */}
          {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-sky-500 text-white hover:bg-sky-700"
                  }`}
                >
                  이전
                </button>
                <span className="self-center">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-sky-500 text-white hover:bg-sky-700"
                  }`}
                >
                  다음
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
