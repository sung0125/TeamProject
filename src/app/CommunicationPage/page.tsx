"use client";

import { useState, useEffect } from "react";
import { getAllCommu } from "@/actions/commuActions";
import Link from "next/link";
import { FaHeart, FaSearch, FaPlus } from "react-icons/fa"; // 하트 아이콘 추가

type Commu = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function CommunicationPage() {
  const [commus, setCommus] = useState<Commu[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const commusPerPage = 6;

  const [likedCommus, setLikedCommus] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== "undefined") {
        const storedLikes = localStorage.getItem("likedCommus");
        return storedLikes ? JSON.parse(storedLikes) : {};
      }
      return {};
    }
  );

  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>(
    () => {
      if (typeof window !== "undefined") {
        const storedLikeCounts = localStorage.getItem("likeCounts");
        return storedLikeCounts ? JSON.parse(storedLikeCounts) : {};
      }
      return {};
    }
  );

  useEffect(() => {
    const fetchCommus = async () => {
      try {
        const response = await getAllCommu(); // commu 관련 데이터로 변경
        setCommus(response.commus);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchCommus();
  }, []);

  const handleLikeToggle = (commuId: string) => {
    setLikedCommus((prev) => {
      const updatedLikes = { ...prev, [commuId]: !prev[commuId] };
      localStorage.setItem("likedCommus", JSON.stringify(updatedLikes));
      return updatedLikes;
    });

    setLikeCounts((prev) => {
      const updatedCounts = {
        ...prev,
        [commuId]: prev[commuId]
          ? prev[commuId] - 1
          : (prev[commuId] || 0) + 1,
      };
      localStorage.setItem("likeCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  };

  const filteredCommus = commus.filter((commu) =>
    commu.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCommu = currentPage * commusPerPage;
  const indexOfFirstCommu = indexOfLastCommu - commusPerPage;
  const currentCommus = filteredCommus.slice(
    indexOfFirstCommu,
    indexOfLastCommu
  );

  const totalPages = Math.ceil(filteredCommus.length / commusPerPage);

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col">
      {/* 상단 메뉴바 */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center bg-sky-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">자유 게시판</h1>
          <div className="space-x-4">
            <Link href="/RecommendPage" className="hover:underline">
              도서 추천 게시판
            </Link>
            <Link href="/RequestPage" className="hover:underline">
              도서 신청 게시판
            </Link>
            <Link href="/QandAPage" className="hover:underline">
              Q&A
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
            placeholder="게시글을 검색하세요..."
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
          href="/addCommu" // commu 관련 추가 페이지로 변경
          className="inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-700 rounded-full w-12 h-12"
        >
          <FaPlus className="text-lg" />
        </Link>
      </div>

      <div>
        <div>
          {currentCommus.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentCommus.map((commu) => (
                <div
                  key={commu._id}
                  className="relative p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-lg font-bold text-sky-700 mb-2">
                    {commu.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{commu.description}</p>
                  <Link
                    href={`/CommunicationPage/${commu._id}`}
                    className="block mt-4 text-sky-500 hover:underline"
                  >
                    자세히 보기 →
                  </Link>

                  <button
                    onClick={() => handleLikeToggle(commu._id)}
                    className="absolute top-2 right-2 flex items-center space-x-1 text-gray-500 hover:text-sky-500 transition"
                  >
                    <FaHeart
                      className={`text-xl ${
                        likedCommus[commu._id]
                          ? "text-sky-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{likeCounts[commu._id] || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">게시글이 없습니다.</p>
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
