import { Tag } from '../valueObjects';
import { BlogPostMeta } from '../entities';

/**
 * Tag with count - Used for tag listings
 */
export interface TagCount {
    readonly tag: Tag;
    readonly count: number;
}

/**
 * Tag Repository Interface (ISP)
 *
 * Focused interface for tag-related operations.
 * Segregated from post reading for SRP.
 */
export interface ITagRepository {
    /**
     * Returns all tags with their post counts
     */
    getAllTags(): Promise<TagCount[]>;

    /**
     * Returns posts matching a tag
     */
    findByTag(tag: Tag): Promise<BlogPostMeta[]>;
}
