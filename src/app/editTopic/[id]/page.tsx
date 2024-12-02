import { getTopic } from '@/actions/topicActions'
import EditTopicForm from '@/components/EditTopicForm'
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function EditTopic({
  params,
}: {
  params: { id: string }
}) {
  const { topic } = await getTopic(params.id)
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="bg-sky-100 py-8">
      <EditTopicForm
        id={topic._id}
        initialTitle={topic.title}
        initialDescription={topic.description}
      />
    </div>
  )
}
