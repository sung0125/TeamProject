"use client";
import { createQanda } from "@/actions/qandaActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddQandaForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.name) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      console.log("게시글 작성 시도:", {
        title,
        description,
        author: session.user.name
      });

      await createQanda(
        title,
        description,
        session.user.name
      );
      
      router.push("/QandAPage");
    } catch (error) {
      console.error("대화 중 오류 : ", error);
      alert("대화 중 오류가 발생했습니다.");
    }
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <h1 className="text-2xl ml-2">자유 게시판</h1>
      <input
        type="text"
        className="border border-sky-500 p-4"
        placeholder="제목"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
      />
      <textarea
        className="border border-sky-500 p-4 h-32"
        placeholder="내용"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        value={description}
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