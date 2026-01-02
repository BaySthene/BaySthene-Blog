import { Slug, Tag } from '../valueObjects';
import { BlogPost, BlogPostMeta } from '../entities';

// Re-export entity classes for convenience
export { BlogPost, BlogPostMeta };

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
 *
 * Returns proper Entity/Value Object instances, not plain objects.
 */
export interface IPostRepository {
    /**
     * Finds a single post by its slug
     * @returns BlogPost entity or null if not found
     */
    findBySlug(slug: Slug): Promise<BlogPost | null>;

    /**
     * Returns all posts, ordered by date descending
     * @returns Array of BlogPostMeta for lightweight listing
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
     * Uses BlogPostMeta.matchesSearch() for domain-driven filtering
     */
    search(query: string): Promise<BlogPostMeta[]>;
}
