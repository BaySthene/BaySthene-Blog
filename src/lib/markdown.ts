import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { cache } from 'react';
import { BlogPost, BlogPostMeta } from './types';

const postsDirectory = path.join(process.cwd(), 'src/content');

// Ensure content directory exists
function ensureContentDirectory() {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Get all post slugs for static generation
export function getAllPostSlugs(): string[] {
    ensureContentDirectory();

    try {
        const fileNames = fs.readdirSync(postsDirectory);
        return fileNames
            .filter((fileName) => fileName.endsWith('.md'))
            .map((fileName) => fileName.replace(/\.md$/, ''));
    } catch {
        return [];
    }
}

// Get single post by slug (Cached)
export const getPostBySlug = cache((slug: string): BlogPost | null => {
    ensureContentDirectory();

    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            content,
            coverImage: data.coverImage || '/images/default-cover.jpg',
            date: data.date || new Date().toISOString(),
            readingTime: calculateReadingTime(content),
            tags: data.tags || [],
            author: {
                name: data.authorName || 'Anonymous',
                avatar: data.authorAvatar || '/images/avatar.jpg',
                bio: data.authorBio || '',
                links: {},
            },
        };
    } catch {
        return null;
    }
});

// Get all posts metadata (Cached)
export const getAllPosts = cache((): BlogPostMeta[] => {
    ensureContentDirectory();

    const slugs = getAllPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is BlogPost => post !== null)
        .map(({ content, author, ...meta }) => meta)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
});

// Convert markdown to HTML with syntax highlighting
export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeHighlight, { detect: true })
        .use(rehypeStringify)
        .process(markdown);

    return result.toString();
}

// Get featured post (latest)
export const getFeaturedPost = cache((): BlogPostMeta | null => {
    const posts = getAllPosts();
    return posts.length > 0 ? posts[0] : null;
});

// Get recent posts (excluding featured)
export const getRecentPosts = cache((count: number = 3): BlogPostMeta[] => {
    const posts = getAllPosts();
    return posts.slice(1, count + 1);
});

// Search posts by title or content
export const searchPosts = cache((query: string): BlogPostMeta[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const posts = getAllPosts();

    return posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.excerpt.toLowerCase().includes(lowerQuery) ||
            post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
});

// Get all unique tags with post counts
export const getAllTags = cache((): { tag: string; count: number }[] => {
    const posts = getAllPosts();
    const tagMap = new Map<string, number>();

    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
    });

    return Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
});

// Get posts by tag
export const getPostsByTag = cache((tag: string): BlogPostMeta[] => {
    const posts = getAllPosts();
    const lowerTag = tag.toLowerCase();

    return posts.filter((post) =>
        post.tags.some((t) => t.toLowerCase() === lowerTag)
    );
});
