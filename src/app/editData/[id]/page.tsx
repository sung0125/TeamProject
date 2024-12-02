import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import EditDataForm from '@/components/EditDataForm'
import { getData } from '@/actions/dataActions'

export default async function EditData({ params }: { params: { id: string } }) {
  const { data } = await getData(params.id)
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="bg-sky-100 py-8">
      <EditDataForm
        id={data._id}
        initialTitle={data.title}
        initialDescription={data.description}
      />
    </div>
  )
}
