export interface Topic {
  _id: string
  title: string
  description: string
  author: string
  genre: string
  createdAt: string
  updatedAt: string
}

export function convertDocToObj(doc: Topic) {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    author: doc.author,
    genre: doc.genre,
    createdAt: doc.createdAt || '',
    updatedAt: doc.updatedAt || '',
  }
}
