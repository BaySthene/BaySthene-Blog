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
 */
export class FileSystemPostRepository implements IPostRepository {
    constructor(private readonly contentDir: string) { }

    private ensureDirectory(): void {
        if (!fs.existsSync(this.contentDir)) {
            fs.mkdirSync(this.contentDir, { recursive: true });
        }
    }

    private parseRawPost(slug: string, fileContents: string): BlogPost {
        const { content, data } = matter(fileContents);

        return {
            slug: Slug.fromPersistence(slug),
            title: (data.title as string) || 'Untitled',
            excerpt: (data.excerpt as string) || '',
            content,
            coverImage: (data.coverImage as string) || '/images/default-cover.jpg',
            date: data.date ? new Date(data.date as string) : new Date(),
            readingTimeMinutes: ReadingTime.fromContent(content).minutes,
            tags: ((data.tags as string[]) || []).map(t => Tag.fromPersistence(t)),
            authorName: (data.authorName as string) || 'Anonymous',
        };
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
                    const post = this.parseRawPost(slug, fileContents);

                    // Return meta without content
                    return {
                        slug: post.slug,
                        title: post.title,
                        excerpt: post.excerpt,
                        coverImage: post.coverImage,
                        date: post.date,
                        readingTimeMinutes: post.readingTimeMinutes,
                        tags: post.tags,
                    } as BlogPostMeta;
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

        const lowerQuery = query.toLowerCase();
        const allPosts = await this.findAll();

        return allPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(lowerQuery) ||
                post.excerpt.toLowerCase().includes(lowerQuery) ||
                post.tags.some((tag) => tag.value.toLowerCase().includes(lowerQuery))
        );
    }
}
