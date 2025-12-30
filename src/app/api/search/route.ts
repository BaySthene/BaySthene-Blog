import { NextRequest, NextResponse } from 'next/server';
import { searchPosts, getAllPosts } from '@/lib/markdown';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const posts = query ? searchPosts(query) : getAllPosts().slice(0, 5);

    return NextResponse.json(posts);
}
