import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = 'https://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        ttbkey: process.env.ALADIN_API_KEY,
        Query: query,
        QueryType: 'Title',
        MaxResults: 10,
        Output: 'JS',
        Version: '20131101',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data from Aladin API:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }

    return NextResponse.json(
      { error: 'Failed to fetch data from Aladin API' },
      { status: 500 }
    );
  }
}
