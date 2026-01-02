import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/factories';

export async function GET(request: NextRequest) {
    const { searchParams: params } = new URL(request.url);
    const query = params.get('q');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '6', 10);

    const { getAllPosts, searchPosts } = ServiceFactory.getBlogServices();

    // Get all matching posts from domain
    const domainPosts = query
        ? await searchPosts.execute(query)
        : await getAllPosts.execute();

    // Transform to JSON-compatible format
    const allPosts = domainPosts.map(post => ({
        slug: post.slug.value,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        date: post.date.toISOString(),
        readingTime: post.readingTimeMinutes,
        tags: post.tags.map(t => t.value),
    }));

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
