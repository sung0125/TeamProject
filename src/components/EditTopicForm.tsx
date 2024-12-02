'use client'
import { updateTopic } from '@/actions/topicActions'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface EditTopicFormProps {
  id: string
  initialTitle: string
  initialDescription: string
}

export default function EditTopicForm({
  id,
  initialTitle,
  initialDescription,
}: EditTopicFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateTopic(id, title, description)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form
      className="max-w-4xl mx-auto flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl">Edit Topic</h1>
      <input
        type="text"
        className="border border-sky-800 p-4"
        placeholder="Topic Title"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
      />
      <textarea
        className="border border-sky-800 p-4 h-32"
        placeholder="Topic Description"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        value={description}
      />
      <button
        className="bg-sky-700 text-sky-400 font-bold px-6 py-3 w-fit rounded-md hover:bg-sky-900"
        type="submit"
      >
        Edit Topic
      </button>
    </form>
  )
}
