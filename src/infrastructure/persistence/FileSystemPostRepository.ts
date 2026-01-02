import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
    IPostRepository,
    BlogPost,
    BlogPostMeta,
    TagCount,
    Slug,
    Tag,
    ReadingTime,
} from '@/domain/blog';

/**
 * File System Post Repository
 *
 * Implements IPostRepository using the local file system.
 * Reads markdown files from a content directory.
 * 
 * Returns proper Entity instances using factory methods.
 */
export class FileSystemPostRepository implements IPostRepository {
    constructor(private readonly contentDir: string) { }

    private ensureDirectory(): void {
        if (!fs.existsSync(this.contentDir)) {
            fs.mkdirSync(this.contentDir, { recursive: true });
        }
    }

    /**
     * Parses raw markdown file to BlogPost Entity
     */
    private parseRawPost(slug: string, fileContents: string): BlogPost {
        const { content, data } = matter(fileContents);

        // Use BlogPost.fromPersistence() factory method
        return BlogPost.fromPersistence({
            slug,
            title: (data.title as string) || 'Untitled',
            excerpt: (data.excerpt as string) || '',
            content,
            coverImage: (data.coverImage as string) || '/images/default-cover.jpg',
            date: data.date ? new Date(data.date as string) : new Date(),
            readingTimeMinutes: ReadingTime.fromContent(content).minutes,
            tags: (data.tags as string[]) || [],
            authorName: (data.authorName as string) || 'Anonymous',
        });
    }

    /**
     * Parses raw markdown file to BlogPostMeta (lightweight, no content)
     */
    private parseRawMeta(slug: string, fileContents: string): BlogPostMeta {
        const { content, data } = matter(fileContents);

        // Use BlogPostMeta.fromPersistence() factory method
        return BlogPostMeta.fromPersistence({
            slug,
            title: (data.title as string) || 'Untitled',
            excerpt: (data.excerpt as string) || '',
            coverImage: (data.coverImage as string) || '/images/default-cover.jpg',
            date: data.date ? new Date(data.date as string) : new Date(),
            readingTimeMinutes: ReadingTime.fromContent(content).minutes,
            tags: (data.tags as string[]) || [],
        });
    }

    async findBySlug(slug: Slug): Promise<BlogPost | null> {
        this.ensureDirectory();
        try {
            const fullPath = path.join(this.contentDir, `${slug.value}.md`);
            if (!fs.existsSync(fullPath)) return null;

            const fileContents = fs.readFileSync(fullPath, 'utf8');
            return this.parseRawPost(slug.value, fileContents);
        } catch {
            return null;
        }
    }

    async findAll(): Promise<BlogPostMeta[]> {
        this.ensureDirectory();
        try {
            const fileNames = fs.readdirSync(this.contentDir);
            const posts = fileNames
                .filter((fileName) => fileName.endsWith('.md'))
                .map((fileName) => {
                    const slug = fileName.replace(/\.md$/, '');
                    const fullPath = path.join(this.contentDir, fileName);
                    const fileContents = fs.readFileSync(fullPath, 'utf8');
                    return this.parseRawMeta(slug, fileContents);
                })
                .sort((a, b) => b.date.getTime() - a.date.getTime());

            return posts;
        } catch {
            return [];
        }
    }

    async findByTag(tag: Tag): Promise<BlogPostMeta[]> {
        const allPosts = await this.findAll();
        return allPosts.filter((post) =>
            post.tags.some((t) => t.equals(tag))
        );
    }

    async getAllSlugs(): Promise<Slug[]> {
        this.ensureDirectory();
        try {
            const fileNames = fs.readdirSync(this.contentDir);
            return fileNames
                .filter((fileName) => fileName.endsWith('.md'))
                .map((fileName) => Slug.fromPersistence(fileName.replace(/\.md$/, '')));
        } catch {
            return [];
        }
    }

    async getAllTags(): Promise<TagCount[]> {
        const allPosts = await this.findAll();
        const tagMap = new Map<string, { tag: Tag; count: number }>();

        allPosts.forEach((post) => {
            post.tags.forEach((tag) => {
                const key = tag.value.toLowerCase();
                const existing = tagMap.get(key);
                if (existing) {
                    existing.count++;
                } else {
                    tagMap.set(key, { tag, count: 1 });
                }
            });
        });

        return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
    }

    async search(query: string): Promise<BlogPostMeta[]> {
        if (!query.trim()) return [];

        const allPosts = await this.findAll();

        // Use domain entity's matchesSearch() method
        return allPosts.filter((post) => post.matchesSearch(query));
    }
}

