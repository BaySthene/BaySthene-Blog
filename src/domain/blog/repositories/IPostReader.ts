import { Slug } from '../valueObjects';
import { BlogPost, BlogPostMeta } from '../entities';

/**
 * Post Reader Interface (ISP)
 *
 * Focused interface for reading blog posts.
 * Segregated from tag-related operations for SRP.
 */
export interface IPostReader {
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
     * Returns all available slugs (for static generation)
     */
    getAllSlugs(): Promise<Slug[]>;

    /**
     * Searches posts by query string
     * Uses BlogPostMeta.matchesSearch() for domain-driven filtering
     */
    search(query: string): Promise<BlogPostMeta[]>;
}
