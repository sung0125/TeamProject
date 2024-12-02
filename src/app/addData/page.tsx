'use client'
import AddDataForm from '@/components/AddDataForm'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AddData() {
  const { data: session } = useSession()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <AddDataForm />
    </div>
  )
}
