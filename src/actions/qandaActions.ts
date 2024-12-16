"use server";
import { convertDocToObj } from "@/libs/helpers";
import connectMongoDB from "@/libs/mongodb";
import Qanda from "@/models/qanda";
import { revalidatePath } from "next/cache";

// create : Data
export async function createQanda(
  title: string,
  description: string,
  author: string
) {
  try {
    console.log("Q&A 생성 시도:", { title, description, author });
    await connectMongoDB();

    const qanda = await Qanda.create({
      title,
      description,
      author,
      content: description,
    });

    console.log("생성된 Q&A:", qanda);
    revalidatePath("/QandaPage");
    return { success: true, qanda };
  } catch (error) {
    console.error("Q&A 생성 에러:", error);
    throw new Error("Failed to create Q&A");
  }
}
//  Update : Data (PUT)
export async function updateQanda(
  id: string,
  title: string,
  description: string
) {
  try {
    await connectMongoDB();
    const doc = await Qanda.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    revalidatePath("/");
    return { success: true, qanda: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 수정에 실패했습니다: ${error}`);
  }
}
// GET by ID : Data
export async function getQanda(id: string) {
  try {
    await connectMongoDB();
    const doc = await Qanda.findById(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    return { success: true, qanda: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`);
  }
}
// GET ALL : DATA
export async function getAllQanda() {
  try {
    await connectMongoDB();
    const docs = await Qanda.find({}).sort({ createdAt: -1 });
    const qandas = docs.map((doc) => convertDocToObj(doc));
    return { success: true, qandas };
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`);
  }
}
// DELETE : Data
export async function deleteQanda(id: string) {
  try {
    await connectMongoDB();
    const doc = await Qanda.findByIdAndDelete(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`);
  }
}

// 특정 Q&A 게시글 가져오기
export async function getQandaById(id: string) {
  try {
    await connectMongoDB();
    const doc = await Qanda.findById(id);
    if (!doc) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    return { success: true, qanda: convertDocToObj(doc) };
  } catch (error) {
    console.error("Error in getQandaById:", error);
    throw new Error(`게시글 조회에 실패했습니다: ${error}`);
  }
}
