import { getCommu } from '@/actions/commuActions'
import EditCommuForm from '@/components/EditCommuForm'
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function EditCommu({
  params,
}: {
  params: { id: string }
}) {
  const { commu } = await getCommu(params.id)
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="bg-sky-100 py-8">
      <EditCommuForm
        id={commu._id}
        initialTitle={commu.title}
        initialDescription={commu.description}
      />
    </div>
  )
}
