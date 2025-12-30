import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, searchPosts } from '@/lib/markdown';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Get all matching posts
    const allPosts = query ? searchPosts(query) : getAllPosts();

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = allPosts.slice(start, end);

    // Calculate metadata
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
        posts,
        pagination: {
            page,
            limit,
            totalPosts,
            totalPages,
            hasMore,
        },
    });
}
