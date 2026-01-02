import {
    IPostRepository,
    BlogPost,
    BlogPostMeta,
    TagCount,
    Slug,
    Tag,
} from '@/domain/blog';

/**
 * Cache Entry with TTL
 */
interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

/**
 * Caching Post Repository (Decorator Pattern)
 *
 * Wraps any IPostRepository implementation to add caching.
 * Follows OCP: extends behavior without modifying the wrapped repository.
 *
 * Cache Strategy:
 * - Read operations are cached
 * - Write operations (if any) would invalidate cache
 * - TTL-based expiration
 */
export class CachingPostRepository implements IPostRepository {
    private cache = new Map<string, CacheEntry<unknown>>();
    private readonly defaultTtl: number;

    constructor(
        private readonly repository: IPostRepository,
        options?: { ttlSeconds?: number }
    ) {
        this.defaultTtl = (options?.ttlSeconds ?? 300) * 1000; // Default: 5 minutes
    }

    // ─────────────────────────────────────────────────────────────
    // IPostReader Methods (Cached)
    // ─────────────────────────────────────────────────────────────

    async findBySlug(slug: Slug): Promise<BlogPost | null> {
        const cacheKey = `post:${slug.value}`;
        return this.getOrFetch(cacheKey, () => this.repository.findBySlug(slug));
    }

    async findAll(): Promise<BlogPostMeta[]> {
        const cacheKey = 'posts:all';
        return this.getOrFetch(cacheKey, () => this.repository.findAll());
    }

    async getAllSlugs(): Promise<Slug[]> {
        const cacheKey = 'slugs:all';
        return this.getOrFetch(cacheKey, () => this.repository.getAllSlugs());
    }

    async search(query: string): Promise<BlogPostMeta[]> {
        const cacheKey = `search:${query.toLowerCase().trim()}`;
        return this.getOrFetch(cacheKey, () => this.repository.search(query));
    }

    // ─────────────────────────────────────────────────────────────
    // ITagRepository Methods (Cached)
    // ─────────────────────────────────────────────────────────────

    async getAllTags(): Promise<TagCount[]> {
        const cacheKey = 'tags:all';
        return this.getOrFetch(cacheKey, () => this.repository.getAllTags());
    }

    async findByTag(tag: Tag): Promise<BlogPostMeta[]> {
        const cacheKey = `tag:${tag.value}`;
        return this.getOrFetch(cacheKey, () => this.repository.findByTag(tag));
    }

    // ─────────────────────────────────────────────────────────────
    // Cache Management
    // ─────────────────────────────────────────────────────────────

    /**
     * Gets from cache or fetches and caches the result
     */
    private async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>
    ): Promise<T> {
        const cached = this.cache.get(key) as CacheEntry<T> | undefined;

        if (cached && cached.expiresAt > Date.now()) {
            return cached.data;
        }

        const data = await fetcher();
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + this.defaultTtl,
        });

        return data;
    }

    /**
     * Invalidates all cache entries
     */
    invalidateAll(): void {
        this.cache.clear();
    }

    /**
     * Invalidates specific cache entry
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }
}
