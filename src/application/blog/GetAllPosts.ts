import { IPostRepository, BlogPostMeta } from '@/domain/blog';

/**
 * Get All Posts Use Case
 *
 * Retrieves all blog posts metadata, sorted by date descending.
 */
export class GetAllPosts {
    constructor(private readonly repository: IPostRepository) { }

    async execute(): Promise<BlogPostMeta[]> {
        return this.repository.findAll();
    }
}
