"use server";
import { convertDocToObj } from "@/libs/helpers";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { revalidatePath } from "next/cache";

//  Create (POST)
// Backend: topicActions.js (예시)
export async function createTopic(
  title: string, 
  description: string, 
  author: string,
  genre: string
) {
  try {
    console.log("토픽 생성 시도:", { title, description, author, genre });
    await connectMongoDB();

    const topic = await Topic.create({
      title,
      description,
      author,
      genre,
      content: description
    });

    console.log("생성된 토픽:", topic);
    revalidatePath("/RecommendPage");
    return { success: true, topic };
  } catch (error) {
    console.error("토픽 생성 에러:", error);
    throw new Error("Failed to create topic");
  }
}

//  Update (PUT)
export async function updateTopic(
id: string, title: string, description: string, genre: string) {
  try {
    await connectMongoDB();
    const topic = await Topic.findByIdAndUpdate(
      id,
      { title, description, genre },
      { new: true }
    );
    
    revalidatePath("/RecommendPage");
    return { success: true, topic };
  } catch (error) {
    console.error("Error updating topic:", error);
    return { success: false };
  }
}

// GET by ID
export async function getTopic(id: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findById(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    return { success: true, topic: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`);
  }
}

// GET ALL
export async function getAllTopics() {
  try {
    await connectMongoDB();
    const docs = await Topic.find({}).sort({ createdAt: -1 });
    const topics = docs.map((doc) => convertDocToObj(doc));
    return { success: true, topics };
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`);
  }
}

// DELETE
export async function deleteTopic(id: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findByIdAndDelete(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다.");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`);
  }
}

export async function getTopicById(id: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findById(id);
    if (!doc) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    return { success: true, topic: convertDocToObj(doc) };
  } catch (error) {
    console.error("Error in getTopicById:", error);
    throw new Error(`게시글 조회에 실패했습니다: ${error}`);
  }
}