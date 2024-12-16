import { getQanda } from '@/actions/qandaActions'
import EditQandaForm from '@/components/EditQandaForm'
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function EditTopic({
  params,
}: {
  params: { id: string }
}) {
  const { qanda } = await getQanda(params.id)
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="bg-sky-100 py-8">
      <EditQandaForm
        id={qanda._id}
        initialTitle={qanda.title}
        initialDescription={qanda.description}
      />
    </div>
  )
}
        