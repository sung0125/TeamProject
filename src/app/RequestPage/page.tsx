"use client"; // 이 줄을 추가하여 클라이언트 컴포넌트로 설정

import { useState, useEffect } from "react";
import { getAllData } from "@/actions/dataActions";
import Link from "next/link";
import { FaHeart, FaSearch, FaPlus } from "react-icons/fa"; // 하트 아이콘 추가

type Data = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function BookRequestPage() {
  const [datas, setDatas] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const datasPerPage = 6;

  const [likedDatas, setLikedDatas] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== "undefined") {
        const storedLikes = localStorage.getItem("likedDatas");
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
    const fetchDatas = async () => {
      try {
        const response = await getAllData();
        setDatas(response.datas);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchDatas();
  }, []);

  const handleLikeToggle = (dataId: string) => {
    setLikedDatas((prev) => {
      const updatedLikes = { ...prev, [dataId]: !prev[dataId] };
      localStorage.setItem("likedDatas", JSON.stringify(updatedLikes));
      return updatedLikes;
    });

    setLikeCounts((prev) => {
      const updatedCounts = {
        ...prev,
        [dataId]: prev[dataId] ? prev[dataId] - 1 : (prev[dataId] || 0) + 1,
      };
      localStorage.setItem("likeCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  };

  const filteredDatas = datas.filter((data) =>
    data.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastData = currentPage * datasPerPage;
  const indexOfFirstData = indexOfLastData - datasPerPage;
  const currentDatas = filteredDatas.slice(
    indexOfFirstData,
    indexOfLastData
  );

  const totalPages = Math.ceil(filteredDatas.length / datasPerPage);

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col">
      {/* 상단 메뉴바 */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center bg-sky-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">도서 신청 게시판</h1>
          <div className="space-x-4">
            <Link href="/RecommendPage" className="hover:underline">
              도서 추천 게시판
            </Link>
            <Link href="/CommunicationPage" className="hover:underline">
              자유 게시판
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
            placeholder="신청 도서를 검색하세요..."
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
          href="/addData"
          className="inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-700 rounded-full w-12 h-12"
        >
          <FaPlus className="text-lg" />
        </Link>
      </div>

      <div>
        <div>
          {currentDatas.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentDatas.map((data) => (
                <div
                  key={data._id}
                  className="relative p-4 border rounded-lg shadow-sm hover:shadow-md transition flex flex-col min-h-[200px]"
                >
                  <div className="flex-grow">
                    <h2 className="text-lg font-bold text-sky-700 mb-2">
                      {data.title}
                    </h2>
                    <p className="text-gray-600 text-sm">{data.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <Link
                      href={`/RequestPage/${data._id}`}
                      className="text-sky-500 hover:text-sky-700 flex items-center space-x-1"
                    >
                      <span>자세히 보기</span>
                      <span>→</span>
                    </Link>

                    <button
                      onClick={() => handleLikeToggle(data._id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-sky-500 transition"
                    >
                      <FaHeart
                        className={`text-xl ${
                          likedDatas[data._id]
                            ? "text-sky-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span>{likeCounts[data._id] || 0}</span>
                    </button>
                  </div>
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
