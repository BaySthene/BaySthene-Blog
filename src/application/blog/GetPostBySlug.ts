import { IPostRepository, BlogPost, Slug } from '@/domain/blog';

/**
 * Get Post By Slug Use Case
 *
 * Retrieves a single blog post by its slug.
 */
export class GetPostBySlug {
    constructor(private readonly repository: IPostRepository) { }

    async execute(slugValue: string): Promise<BlogPost | null> {
        const slug = Slug.create(slugValue);
        return this.repository.findBySlug(slug);
    }
}
