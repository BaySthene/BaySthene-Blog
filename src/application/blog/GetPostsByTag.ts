import { IPostRepository, BlogPostMeta, Tag } from '@/domain/blog';

/**
 * Get Posts By Tag Use Case
 *
 * Retrieves all blog posts with a specific tag.
 */
export class GetPostsByTag {
    constructor(private readonly repository: IPostRepository) { }

    async execute(tagValue: string): Promise<BlogPostMeta[]> {
        const tag = Tag.create(tagValue);
        return this.repository.findByTag(tag);
    }
}
