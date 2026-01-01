/**
 * Blog Adapters
 *
 * Provides backward-compatible functions that use the new DDD architecture
 * but expose the same API as the legacy markdown.ts functions.
 *
 * This enables gradual migration without breaking existing pages.
 */

import { cache } from 'react';
import { ServiceFactory } from '@/application';
import type { BlogPostMeta as DomainPostMeta, TagCount } from '@/domain/blog';

/**
 * Legacy BlogPostMeta format (with string slug and number readingTime)
 */
export interface LegacyBlogPostMeta {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    readingTime: number;
    tags: string[];
}

/**
 * Converts domain BlogPostMeta to legacy format
 */
function tolegacyMeta(post: DomainPostMeta): LegacyBlogPostMeta {
    return {
        slug: post.slug.value,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        date: post.date.toISOString(),
        readingTime: post.readingTimeMinutes,
        tags: post.tags.map(t => t.value),
    };
}

/**
 * Get all posts (legacy-compatible)
 */
export const getAllPosts = cache(async (): Promise<LegacyBlogPostMeta[]> => {
    const { getAllPosts } = ServiceFactory.getBlogServices();
    const posts = await getAllPosts.execute();
    return posts.map(tolegacyMeta);
});

/**
 * Get featured post (legacy-compatible)
 */
export const getFeaturedPost = cache(async (): Promise<LegacyBlogPostMeta | null> => {
    const posts = await getAllPosts();
    return posts.length > 0 ? posts[0] : null;
});

/**
 * Get recent posts excluding featured (legacy-compatible)
 */
export const getRecentPosts = cache(async (count: number = 3): Promise<LegacyBlogPostMeta[]> => {
    const posts = await getAllPosts();
    return posts.slice(1, count + 1);
});

/**
 * Search posts (legacy-compatible)
 */
export const searchPosts = cache(async (query: string): Promise<LegacyBlogPostMeta[]> => {
    const { searchPosts } = ServiceFactory.getBlogServices();
    const posts = await searchPosts.execute(query);
    return posts.map(tolegacyMeta);
});

/**
 * Get posts by tag (legacy-compatible)
 */
export const getPostsByTag = cache(async (tag: string): Promise<LegacyBlogPostMeta[]> => {
    const { getPostsByTag } = ServiceFactory.getBlogServices();
    const posts = await getPostsByTag.execute(tag);
    return posts.map(tolegacyMeta);
});

/**
 * Get all tags with counts (legacy-compatible)
 */
export const getAllTags = cache(async (): Promise<{ tag: string; count: number }[]> => {
    const { getAllTags } = ServiceFactory.getBlogServices();
    const tags: TagCount[] = await getAllTags.execute();
    return tags.map(t => ({ tag: t.tag.value, count: t.count }));
});

/**
 * Get all slugs for static generation (legacy-compatible)
 */
export const getAllPostSlugs = cache(async (): Promise<string[]> => {
    const { getAllSlugs } = ServiceFactory.getBlogServices();
    const slugs = await getAllSlugs.execute();
    return slugs.map(s => s.value);
});

/**
 * Legacy BlogPost format (with content and author)
 */
export interface LegacyBlogPost extends LegacyBlogPostMeta {
    content: string;
    author: {
        name: string;
        avatar: string;
        bio: string;
        links: Record<string, string>;
    };
}

/**
 * Get post by slug (legacy-compatible)
 */
export const getPostBySlug = cache(async (slug: string): Promise<LegacyBlogPost | null> => {
    const { getPostBySlug } = ServiceFactory.getBlogServices();
    try {
        const post = await getPostBySlug.execute(slug);
        if (!post) return null;

        return {
            slug: post.slug.value,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            date: post.date.toISOString(),
            readingTime: post.readingTimeMinutes,
            tags: post.tags.map(t => t.value),
            author: {
                name: post.authorName,
                avatar: '/images/avatar.jpg',
                bio: '',
                links: {},
            },
        };
    } catch {
        return null;
    }
});

/**
 * Convert markdown to HTML (uses legacy MarkdownService for now)
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    // Import dynamically to avoid circular deps
    const { MarkdownService } = await import('@/services/MarkdownService');
    return MarkdownService.toHtml(markdown);
}

