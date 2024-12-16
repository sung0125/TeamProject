"use client";
import { createData } from "@/actions/dataActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddDataForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(`저자: 
장르: 
출판사: 
신청 이유: `); // 고정 텍스트
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.name) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      console.log("게시물 작성 시도:", {
        title,
        description,
        author: session.user.name,
      });

      const result = await createData(
        title,
        description,
        session.user.name,
      );

      console.log("생성된 게시물:", result);
      router.push("/RequestPage");
      router.refresh();
    } catch (error) {
      console.error("게시물 작성 중 오류:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <h1 className="text-2xl ml-2">도서 신청</h1>
      <input
        type="text"
        className="border border-sky-500 p-4"
        placeholder="제목"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
      />
      <textarea
        className="border border-sky-500 p-4 h-32"
        placeholder="내용"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        required
      />

      <button
        className="bg-sky-300 text-sky-100 font-bold px-6 py-3 w-fit rounded-md hover:bg-sky-500"
        type="submit"
      >
        완료
      </button>
    </form>
  );
}

