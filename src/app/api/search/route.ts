import { NextRequest, NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/factories';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q');
    const { getAllPosts, searchPosts } = ServiceFactory.getBlogServices();

    // Get domain posts
    const domainPosts = query
        ? await searchPosts.execute(query)
        : (await getAllPosts.execute()).slice(0, 5);

    // Transform to JSON-compatible format
    const posts = domainPosts.map(post => ({
        slug: post.slug.value,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        date: post.date.toISOString(),
        readingTime: post.readingTimeMinutes,
        tags: post.tags.map(t => t.value),
    }));

    return NextResponse.json(posts);
}
