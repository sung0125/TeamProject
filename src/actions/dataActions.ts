'use server'
import { convertDocToObj } from '@/libs/helpers'
import connectMongoDB from '@/libs/mongodb'
import Data from '@/models/data'
import { revalidatePath } from 'next/cache'

// create : Data
export async function createData(title: string, description: string) {
  try {
    await connectMongoDB()
    const doc = await Data.create({ title, description })
    revalidatePath('/')
    return { success: true, topic: convertDocToObj(doc) }
  } catch (error) {
    throw new Error(`토픽 생성에 실패했습니다: ${error}`)
  }
}
//  Update : Data (PUT)
export async function updateData(
  id: string,
  title: string,
  description: string
) {
  try {
    await connectMongoDB()
    const doc = await Data.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    revalidatePath('/')
    return { success: true, data: convertDocToObj(doc) }
  } catch (error) {
    throw new Error(`토픽 수정에 실패했습니다: ${error}`)
  }
}
// GET by ID : Data
export async function getData(id: string) {
  try {
    await connectMongoDB()
    const doc = await Data.findById(id)
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    return { success: true, data: convertDocToObj(doc) }
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`)
  }
}
// GET ALL : DATA
export async function getAllData() {
  try {
    await connectMongoDB()
    const docs = await Data.find({}).sort({ createdAt: -1 })
    const datas = docs.map((doc) => convertDocToObj(doc))
    return { success: true, datas }
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`)
  }
}
// DELETE : Data
export async function deleteData(id: string) {
  try {
    await connectMongoDB()
    const doc = await Data.findByIdAndDelete(id)
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`)
  }
}
