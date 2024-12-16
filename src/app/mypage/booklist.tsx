// src/app/mypage/BookList.tsx
import React from 'react'

type BookData = {
  id: string
  title: string
}

type BookListProps = {
  books: BookData[]
  title: string
}

const BookList: React.FC<BookListProps> = ({ books, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default BookList
