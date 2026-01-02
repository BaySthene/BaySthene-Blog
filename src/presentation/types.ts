/**
 * Presentation Layer Types
 *
 * These types are for React components and represent
 * the view model format (primitives, not domain Value Objects).
 * Components should use these types for props.
 */

import type { BlogPostMeta as DomainPostMeta, BlogPost as DomainPost } from '@/domain/blog';

/**
 * Blog post metadata for display in cards and lists
 */
export interface PostViewModel {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    readingTime: number;
    tags: string[];
}

/**
 * Full blog post with content for detail pages
 */
export interface PostDetailViewModel extends PostViewModel {
    content: string;
    authorName: string;
}

/**
 * Tag with post count for tag listings
 */
export interface TagViewModel {
    tag: string;
    count: number;
}

/**
 * Transforms domain BlogPostMeta to presentation PostViewModel
 */
export function toPostViewModel(post: DomainPostMeta): PostViewModel {
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
 * Transforms domain BlogPost to presentation PostDetailViewModel
 */
export function toPostDetailViewModel(post: DomainPost): PostDetailViewModel {
    return {
        slug: post.slug.value,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        date: post.date.toISOString(),
        readingTime: post.readingTimeMinutes,
        tags: post.tags.map(t => t.value),
        authorName: post.authorName,
    };
}
