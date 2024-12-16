import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get("isbn");
    const ALADIN_API_KEY = process.env.ALADIN_API_KEY;

    if (!isbn) {
        return NextResponse.json({ error: "ISBN이 필요합니다" }, { status: 400 });
    }

    try {
        const url = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn}&Output=JS&Version=20131101&OptResult=description,toc&Cover=Big`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("알라딘 API 오류");
        }

        // 응답 데이터 확인
        console.log("API 응답 전체 데이터:", data);

        if (!data.item || !data.item[0]) {
            throw new Error("도서 정보가 없습니다");
        }

        const item = data.item[0];

        // 전체 도서 정보를 포함하여 반환
        const bookData = {
            title: item.title,
            author: item.author,
            publisher: item.publisher,
            pubDate: item.pubDate,
            cover: item.cover,
            description: item.description || "책 소개가 없습니다.",
            pages: item.subInfo?.itemPage || "페이지 정보가 없습니다.",
            toc: item.toc || "목차 정보가 없습니다.",
            link: item.link,
            isbn: item.isbn13,
        };

        return NextResponse.json(bookData);
    } catch (error) {
        console.error("API 오류:", error);
        return NextResponse.json({ error: "도서 상세 정보를 가져오는데 실패했습니다." }, { status: 500 });
    }
}
