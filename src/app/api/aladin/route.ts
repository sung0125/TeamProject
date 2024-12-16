import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "검색어가 필요합니다" }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${
                process.env.ALADIN_API_KEY
            }&Query=${encodeURIComponent(query)}&MaxResults=100&start=1&SearchTarget=Book&Output=js&Version=20131101`
        );

        const data = await response.json();

        const formattedResults = data.item.map((item: any) => ({
            title: item.title,
            author: item.author,
            publisher: item.publisher,
            pubDate: item.pubDate,
            cover: item.cover || item.coverLargeUrl,
            link: item.link,
        }));

        return NextResponse.json(formattedResults);
    } catch (error) {
        console.error("Aladin API Error:", error);
        return NextResponse.json({ error: "검색 결과를 가져오는데 실패했습니다" }, { status: 500 });
    }
}
