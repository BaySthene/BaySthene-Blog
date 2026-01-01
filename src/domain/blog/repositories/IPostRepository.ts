import { Slug, Tag } from '../valueObjects';

/**
 * Blog Post Meta - Lightweight representation without content
 * Used for listings and search results
 */
export interface BlogPostMeta {
    readonly slug: Slug;
    readonly title: string;
    readonly excerpt: string;
    readonly coverImage: string;
    readonly date: Date;
    readonly readingTimeMinutes: number;
    readonly tags: readonly Tag[];
}

/**
 * Blog Post - Full post with content
 */
export interface BlogPost extends BlogPostMeta {
    readonly content: string;
    readonly authorName: string;
}

/**
 * Tag with count - Used for tag listings
 */
export interface TagCount {
    readonly tag: Tag;
    readonly count: number;
}

/**
 * Post Repository Interface
 *
 * Defines the contract for blog post persistence.
 * Implementation details (file system, CMS, database) are hidden.
 */
export interface IPostRepository {
    /**
     * Finds a single post by its slug
     */
    findBySlug(slug: Slug): Promise<BlogPost | null>;

    /**
     * Returns all posts, ordered by date descending
     */
    findAll(): Promise<BlogPostMeta[]>;

    /**
     * Returns posts matching a tag
     */
    findByTag(tag: Tag): Promise<BlogPostMeta[]>;

    /**
     * Returns all available slugs (for static generation)
     */
    getAllSlugs(): Promise<Slug[]>;

    /**
     * Returns all tags with their post counts
     */
    getAllTags(): Promise<TagCount[]>;

    /**
     * Searches posts by query string
     */
    search(query: string): Promise<BlogPostMeta[]>;
}
