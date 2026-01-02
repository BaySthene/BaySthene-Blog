import { IPostRepository, BlogPostMeta } from '@/domain/blog';

/**
 * Search Posts Use Case
 *
 * Searches blog posts by query string.
 */
export class SearchPosts {
    constructor(private readonly repository: IPostRepository) { }

    async execute(query: string): Promise<BlogPostMeta[]> {
        return this.repository.search(query);
    }
}
