import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceFactory } from '@/application/factories';
import {
    IPostRepository,
    BlogPost,
    BlogPostMeta,
    TagCount,
    Slug,
    Tag,
} from '@/domain/blog';

/**
 * Use Case Tests
 *
 * Tests application layer use cases with mock repository.
 * Verifies orchestration logic without file system dependencies.
 */

// ─────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────

const createMockPost = (slug: string, title: string, tags: string[] = []): BlogPost => {
    return BlogPost.fromPersistence({
        slug,
        title,
        excerpt: `Excerpt for ${title}`,
        content: `Content for ${title}`,
        coverImage: '/images/cover.jpg',
        date: new Date('2025-01-01'),
        readingTimeMinutes: 5,
        tags,
        authorName: 'Test Author',
    });
};

const createMockMeta = (slug: string, title: string, tags: string[] = []): BlogPostMeta => {
    return BlogPostMeta.fromPersistence({
        slug,
        title,
        excerpt: `Excerpt for ${title}`,
        coverImage: '/images/cover.jpg',
        date: new Date('2025-01-01'),
        readingTimeMinutes: 5,
        tags,
    });
};

// ─────────────────────────────────────────────────────────────
// Mock Repository Factory
// ─────────────────────────────────────────────────────────────

const createMockRepository = (): IPostRepository => ({
    findBySlug: vi.fn(),
    findAll: vi.fn(),
    findByTag: vi.fn(),
    getAllSlugs: vi.fn(),
    getAllTags: vi.fn(),
    search: vi.fn(),
});

// ─────────────────────────────────────────────────────────────
// GetPostBySlug Tests
// ─────────────────────────────────────────────────────────────

describe('GetPostBySlug', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return post when found', async () => {
        const expectedPost = createMockPost('test-slug', 'Test Post');
        vi.mocked(mockRepository.findBySlug).mockResolvedValue(expectedPost);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getPostBySlug.execute('test-slug');

        expect(result).toBe(expectedPost);
        expect(mockRepository.findBySlug).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'test-slug' })
        );
    });

    it('should return null when post not found', async () => {
        vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getPostBySlug.execute('non-existent');

        expect(result).toBeNull();
    });

    it('should throw InvalidSlugError for invalid slug', async () => {
        const services = ServiceFactory.createBlogServices(mockRepository);

        await expect(services.getPostBySlug.execute('')).rejects.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────
// GetAllPosts Tests
// ─────────────────────────────────────────────────────────────

describe('GetAllPosts', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return all posts sorted by date', async () => {
        const posts = [
            createMockMeta('post-1', 'Post 1'),
            createMockMeta('post-2', 'Post 2'),
        ];
        vi.mocked(mockRepository.findAll).mockResolvedValue(posts);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getAllPosts.execute();

        expect(result).toEqual(posts);
        expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no posts exist', async () => {
        vi.mocked(mockRepository.findAll).mockResolvedValue([]);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getAllPosts.execute();

        expect(result).toEqual([]);
    });
});

// ─────────────────────────────────────────────────────────────
// SearchPosts Tests
// ─────────────────────────────────────────────────────────────

describe('SearchPosts', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return matching posts for query', async () => {
        const matchingPosts = [createMockMeta('react-hooks', 'React Hooks Guide')];
        vi.mocked(mockRepository.search).mockResolvedValue(matchingPosts);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.searchPosts.execute('react');

        expect(result).toEqual(matchingPosts);
        expect(mockRepository.search).toHaveBeenCalledWith('react');
    });

    it('should return empty array for no matches', async () => {
        vi.mocked(mockRepository.search).mockResolvedValue([]);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.searchPosts.execute('nonexistent');

        expect(result).toEqual([]);
    });
});

// ─────────────────────────────────────────────────────────────
// GetPostsByTag Tests
// ─────────────────────────────────────────────────────────────

describe('GetPostsByTag', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return posts with the specified tag', async () => {
        const taggedPosts = [
            createMockMeta('react-intro', 'React Introduction', ['React']),
        ];
        vi.mocked(mockRepository.findByTag).mockResolvedValue(taggedPosts);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getPostsByTag.execute('React');

        expect(result).toEqual(taggedPosts);
        expect(mockRepository.findByTag).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'React' })
        );
    });
});

// ─────────────────────────────────────────────────────────────
// GetAllTags Tests
// ─────────────────────────────────────────────────────────────

describe('GetAllTags', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return all tags with counts', async () => {
        const tags: TagCount[] = [
            { tag: Tag.fromPersistence('React'), count: 5 },
            { tag: Tag.fromPersistence('TypeScript'), count: 3 },
        ];
        vi.mocked(mockRepository.getAllTags).mockResolvedValue(tags);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getAllTags.execute();

        expect(result).toEqual(tags);
    });
});

// ─────────────────────────────────────────────────────────────
// GetAllSlugs Tests
// ─────────────────────────────────────────────────────────────

describe('GetAllSlugs', () => {
    let mockRepository: IPostRepository;

    beforeEach(() => {
        mockRepository = createMockRepository();
    });

    it('should return all slugs', async () => {
        const slugs = [
            Slug.fromPersistence('post-1'),
            Slug.fromPersistence('post-2'),
        ];
        vi.mocked(mockRepository.getAllSlugs).mockResolvedValue(slugs);

        const services = ServiceFactory.createBlogServices(mockRepository);
        const result = await services.getAllSlugs.execute();

        expect(result).toEqual(slugs);
    });
});
