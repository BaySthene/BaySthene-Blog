import { IPostRepository, TagCount, Slug } from '@/domain/blog';

/**
 * Get All Tags Use Case
 *
 * Retrieves all unique tags with their post counts.
 */
export class GetAllTags {
    constructor(private readonly repository: IPostRepository) { }

    async execute(): Promise<TagCount[]> {
        return this.repository.getAllTags();
    }
}

/**
 * Get All Slugs Use Case
 *
 * Retrieves all post slugs (for static generation).
 */
export class GetAllSlugs {
    constructor(private readonly repository: IPostRepository) { }

    async execute(): Promise<Slug[]> {
        return this.repository.getAllSlugs();
    }
}
