'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import AddTopicForm from '@/components/AddTopicForm'
export default function AddTopic() {
  const { data: session } = useSession()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <AddTopicForm />
    </div>
  )
}
