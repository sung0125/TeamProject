"use client"; // 이 줄을 추가하여 클라이언트 컴포넌트로 설정

import { useState, useEffect } from "react";
import { getAllTopics } from "@/actions/topicActions";
import Link from "next/link";
import { FaThumbsUp, FaSearch, FaPlus } from "react-icons/fa";

type Topic = {
  _id: string;
  title: string;
  description: string;
  author: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
};

export default function BookRecommendationPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [expandedGenre, setExpandedGenre] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const topicsPerPage = 6;

  const [likedTopics, setLikedTopics] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== "undefined") {
        const storedLikes = localStorage.getItem("likedTopics");
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

  const genreHierarchy = {
    소설: ["로맨스", "판타지", "추리"],
    비소설: ["자서전", "역사", "에세이"],
    과학: ["물리", "생물", "천문학"],
    기술: ["프로그래밍", "데이터", "보안"],
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getAllTopics();
        console.log("가져온 게시물들:", response.topics);
        setTopics(response.topics);
      } catch (error) {
        console.error("게시물 가져오기 오류:", error);
      }
    };
    fetchTopics();
  }, []);

  const handleLikeToggle = (topicId: string) => {
    setLikedTopics((prev) => {
      const updatedLikes = { ...prev, [topicId]: !prev[topicId] };
      localStorage.setItem("likedTopics", JSON.stringify(updatedLikes));
      return updatedLikes;
    });

    setLikeCounts((prev) => {
      const updatedCounts = {
        ...prev,
        [topicId]: prev[topicId] ? prev[topicId] - 1 : (prev[topicId] || 0) + 1,
      };
      localStorage.setItem("likeCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });
  };

  const handleGenreSelect = (genre: string) => {
    console.log('이전 선택된 장르:', selectedGenre);
    console.log('새로 선택한 장르:', genre);
    setSelectedGenre(genre);
    setTimeout(() => {
      console.log('업데이트된 장르:', selectedGenre);
    }, 0);
  };

  const handleParentGenreClick = (parent: string) => {
    console.log('상위 장르 클릭:', parent);
    if (expandedGenre === parent) {
      setExpandedGenre("");
      handleGenreSelect("");
    } else {
      setExpandedGenre(parent);
      handleGenreSelect(parent);
    }
  };

  const handleChildGenreClick = (parent: string, child: string) => {
    const fullGenre = `${parent}.${child}`;
    console.log('하위 장르 클릭:', fullGenre);
    handleGenreSelect(fullGenre);
  };

  const filteredTopics = topics.filter((topic) => {
    // 검색어 필터링 (제목이나 설명에 검색어가 포함되어 있는지 확인)
    const matchesSearch = 
      searchQuery === "" || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 장르 필터링 (기존 코드)
    const matchesGenre = 
      selectedGenre === "" || 
      (topic.genre && (
        topic.genre === selectedGenre ||
        (!selectedGenre.includes(".") && topic.genre.startsWith(selectedGenre + "."))
      ));

    // 검색어와 장르 모두 일치하는 경우에만 true 반환
    return matchesSearch && matchesGenre;
  });

  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = filteredTopics.slice(
    indexOfFirstTopic,
    indexOfLastTopic
  );

  const totalPages = Math.ceil(filteredTopics.length / topicsPerPage);

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col">
      {/* 상단 메뉴바 */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center bg-sky-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">도서 추천 게시판</h1>
          <div className="space-x-4">
            <Link href="/RequestPage" className="hover:underline">
              도서 신청 게시판
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
            placeholder="추천 도서를 검색하세요..."
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
          href="/addTopic"
          className="inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-700 rounded-full w-12 h-12"
        >
          <FaPlus className="text-lg" />
        </Link>
      </div>

      <div className="flex">
        <div className="w-1/4 pr-6">
          <h2 className="text-lg font-bold mb-4 text-sky-700">장르 필터</h2>
          <ul>
            <li>
              <button
                onClick={() => handleGenreSelect("")}
                className={`block w-full text-left py-2 px-4 rounded-lg ${
                  selectedGenre === ""
                    ? "bg-sky-500 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                전체
              </button>
            </li>
            {Object.entries(genreHierarchy).map(([parent, children]) => (
              <li key={parent} className="mb-2">
                <button
                  onClick={() => handleParentGenreClick(parent)}
                  className={`block w-full text-left py-2 px-4 rounded-lg ${
                    selectedGenre === parent
                      ? "bg-sky-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {parent}
                </button>
                {expandedGenre === parent && (
                  <ul className="ml-4 mt-2">
                    {children.map((child) => (
                      <li key={child}>
                        <button
                          onClick={() => handleChildGenreClick(parent, child)}
                          className={`block w-full text-left py-2 px-4 rounded-lg ${
                            selectedGenre === `${parent}.${child}`
                              ? "bg-sky-500 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {child}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4">
          <div>
            {currentTopics.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentTopics.map((topic) => (
                  <div
                    key={topic._id}
                    className="relative p-4 border rounded-lg shadow-sm hover:shadow-md transition flex flex-col min-h-[200px]"
                  >

                    {/* 게시물 내용 */}
                    <div className="flex-grow">
                      <h2 className="text-lg font-bold text-sky-700 mb-2">
                        {topic.title}
                      </h2>
                      {topic.genre && (
                        <p className="text-gray-600 text-sm mb-2">
                          장르: {topic.genre.replace(".", " > ")}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleLikeToggle(topic._id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-sky-500 transition"
                      >
                        <FaThumbsUp
                          className={`text-xl ${
                            likedTopics[topic._id]
                              ? "text-sky-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span>{likeCounts[topic._id] || 0}</span>
                      </button>

                      <Link
                        href={`/RecommendPage/${topic._id}`}
                        className="text-sky-500 hover:text-sky-700 flex items-center space-x-1"
                      >
                        <span>자세히 보기</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">추천 도서가 없습니다.</p>
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
    </div>
  );
}
