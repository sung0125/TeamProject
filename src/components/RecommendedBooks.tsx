"use client";

import { useEffect, useState } from "react";

interface Book {
    title: string;
    link: string;
    author: string;
}

export default function RecommendedBooks() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("/api/books"); // API 라우트를 만들어야 합니다
                const data = await response.json();

                // 받아온 데이터에서 랜덤으로 3개 선택
                const randomBooks = data.sort(() => Math.random() - 0.5).slice(0, 3);
                setBooks(randomBooks);
            } catch (error) {
                console.error("책 데이터를 가져오는데 실패했습니다:", error);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className="mt-6 bg-sky-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-sky-700 text-center">추천 도서</h2>
            <ul className="list-disc list-inside text-sky-600">
                {books.map((book, index) => (
                    <li key={index}>
                        <a href={book.link} target="_blank" rel="noopener noreferrer" className="hover:text-sky-800">
                            {book.title} - {book.author}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
