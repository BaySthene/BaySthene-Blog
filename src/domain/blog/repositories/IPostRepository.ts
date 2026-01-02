import { BlogPost, BlogPostMeta } from '../entities';
import { IPostReader } from './IPostReader';
import { ITagRepository, TagCount } from './ITagRepository';

// Re-export entity classes and types for convenience
export { BlogPost, BlogPostMeta };
export type { TagCount };

/**
 * Post Repository Interface
 *
 * Composite interface that combines:
 * - IPostReader: Post reading and search operations
 * - ITagRepository: Tag-related operations
 *
 * Implementation details (file system, CMS, database, API) are hidden.
 * Returns proper Entity/Value Object instances, not plain objects.
 *
 * ISP: Consumers can depend on IPostReader or ITagRepository
 * if they only need a subset of functionality.
 */
export interface IPostRepository extends IPostReader, ITagRepository { }

