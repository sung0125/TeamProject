"use server";
import { convertDocToObj } from "@/libs/helpers";
import connectMongoDB from "@/libs/mongodb";
import Commu from "@/models/commu";
import { revalidatePath } from "next/cache";

// create : Data
export async function createCommu(title: string, description: string, author: string) {
  try {
    console.log("게시글 생성 시작:", { title, description, author });
    await connectMongoDB();
    
    const authorName = author || "익명";
    
    const commu = await Commu.create({
      title,
      description,
      author: authorName,
    });

    console.log("생성된 게시글:", commu);
    revalidatePath("/CommunicationPage");
    return { success: true, commu: convertDocToObj(commu) };
  } catch (error) {
    console.error("게시글 생성 에러:", error);
    throw new Error(`게시글 생성에 실패했습니다: ${error}`);
  }
}
//  Update : Data (PUT)
export async function updateCommu(
  id: string,
  title: string,
  description: string
) {
  try {
    await connectMongoDB();
    const doc = await Commu.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    revalidatePath("/");
    return { success: true, commu: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 수정에 실패했습니다: ${error}`);
  }
}
// GET by ID : Data
export async function getCommu(id: string) {
  try {
    await connectMongoDB();
    const doc = await Commu.findById(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    return { success: true, commu: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`);
  }
}
// GET ALL : DATA
export async function getAllCommu() {
  try {
    await connectMongoDB();
    const docs = await Commu.find({}).sort({ createdAt: -1 });
    const commus = docs.map((doc) => convertDocToObj(doc));
    return { success: true, commus };
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`);
  }
}
// DELETE : Data
export async function deleteCommu(id: string) {
  try {
    await connectMongoDB();
    const doc = await Commu.findByIdAndDelete(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`);
  }
}

export async function getCommuById(id: string) {
  try {
    console.log("게시글 조회 시작:", id);
    await connectMongoDB();
    const commu = await Commu.findById(id);
    if (!commu) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    console.log("조회된 게시글:", commu);
    return { success: true, commu: convertDocToObj(commu) };
  } catch (error) {
    console.error("게시글 조회 에러:", error);
    throw new Error(`게시글 조회에 실패했습니다: ${error}`);
  }
}
