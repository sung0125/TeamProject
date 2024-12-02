import { getAllData } from '@/actions/dataActions'
import DatasList from '@/components/Datalist'

export default async function addData() {
  const { datas } = await getAllData()
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <DatasList datas={datas} />
    </div>
  )
}
