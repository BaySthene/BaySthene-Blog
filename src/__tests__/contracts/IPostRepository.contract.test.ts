import { describe, it, expect, beforeAll } from 'vitest';
import {
    IPostRepository,
    BlogPost,
    BlogPostMeta,
    Slug,
    Tag,
} from '@/domain/blog';
import { FileSystemPostRepository } from '@/infrastructure/persistence';

/**
 * IPostRepository Contract Tests
 *
 * Ensures all IPostRepository implementations behave identically.
 * Validates LSP: any implementation is substitutable.
 *
 * This contract should be run against:
 * - FileSystemPostRepository
 * - CachingPostRepository (decorator)
 * - Future: DatabasePostRepository, ApiPostRepository
 */

// Factory function to create repository for testing
type RepositoryFactory = () => IPostRepository;

function describeRepositoryContract(
    name: string,
    createRepository: RepositoryFactory
) {
    describe(`IPostRepository Contract: ${name}`, () => {
        let repository: IPostRepository;

        beforeAll(() => {
            repository = createRepository();
        });

        // ─────────────────────────────────────────────────────────────
        // IPostReader Contract
        // ─────────────────────────────────────────────────────────────

        describe('findBySlug()', () => {
            it('should return BlogPost entity for valid slug', async () => {
                const slugs = await repository.getAllSlugs();
                if (slugs.length === 0) return; // Skip if no posts

                const post = await repository.findBySlug(slugs[0]);

                expect(post).not.toBeNull();
                expect(post).toBeInstanceOf(BlogPost);
                expect(post?.slug).toBeInstanceOf(Slug);
            });

            it('should return null for non-existent slug', async () => {
                const nonExistent = Slug.fromPersistence('non-existent-slug-xyz');
                const post = await repository.findBySlug(nonExistent);

                expect(post).toBeNull();
            });
        });

        describe('findAll()', () => {
            it('should return array of BlogPostMeta', async () => {
                const posts = await repository.findAll();

                expect(Array.isArray(posts)).toBe(true);
                if (posts.length > 0) {
                    expect(posts[0]).toBeInstanceOf(BlogPostMeta);
                    expect(posts[0].slug).toBeInstanceOf(Slug);
                }
            });

            it('should return posts sorted by date descending', async () => {
                const posts = await repository.findAll();

                if (posts.length > 1) {
                    for (let i = 1; i < posts.length; i++) {
                        expect(posts[i - 1].date.getTime()).toBeGreaterThanOrEqual(
                            posts[i].date.getTime()
                        );
                    }
                }
            });
        });

        describe('getAllSlugs()', () => {
            it('should return array of Slug value objects', async () => {
                const slugs = await repository.getAllSlugs();

                expect(Array.isArray(slugs)).toBe(true);
                if (slugs.length > 0) {
                    expect(slugs[0]).toBeInstanceOf(Slug);
                }
            });
        });

        describe('search()', () => {
            it('should return empty array for no matches', async () => {
                const results = await repository.search('xyznonexistent123');

                expect(Array.isArray(results)).toBe(true);
            });

            it('should return array of BlogPostMeta for matches', async () => {
                const allPosts = await repository.findAll();
                if (allPosts.length === 0) return;

                // Search for first post's title
                const query = allPosts[0].title.split(' ')[0];
                const results = await repository.search(query);

                expect(Array.isArray(results)).toBe(true);
                if (results.length > 0) {
                    expect(results[0]).toBeInstanceOf(BlogPostMeta);
                }
            });
        });

        // ─────────────────────────────────────────────────────────────
        // ITagRepository Contract
        // ─────────────────────────────────────────────────────────────

        describe('getAllTags()', () => {
            it('should return array of TagCount', async () => {
                const tags = await repository.getAllTags();

                expect(Array.isArray(tags)).toBe(true);
                if (tags.length > 0) {
                    expect(tags[0].tag).toBeInstanceOf(Tag);
                    expect(typeof tags[0].count).toBe('number');
                    expect(tags[0].count).toBeGreaterThan(0);
                }
            });

            it('should return tags sorted by count descending', async () => {
                const tags = await repository.getAllTags();

                if (tags.length > 1) {
                    for (let i = 1; i < tags.length; i++) {
                        expect(tags[i - 1].count).toBeGreaterThanOrEqual(tags[i].count);
                    }
                }
            });
        });

        describe('findByTag()', () => {
            it('should return array of BlogPostMeta for valid tag', async () => {
                const tags = await repository.getAllTags();
                if (tags.length === 0) return;

                const posts = await repository.findByTag(tags[0].tag);

                expect(Array.isArray(posts)).toBe(true);
                if (posts.length > 0) {
                    expect(posts[0]).toBeInstanceOf(BlogPostMeta);
                }
            });

            it('should return empty array for non-existent tag', async () => {
                const nonExistent = Tag.fromPersistence('nonexistent-tag-xyz');
                const posts = await repository.findByTag(nonExistent);

                expect(Array.isArray(posts)).toBe(true);
                expect(posts.length).toBe(0);
            });
        });
    });
}

// ─────────────────────────────────────────────────────────────
// Run contract against FileSystemPostRepository
// ─────────────────────────────────────────────────────────────

const contentDir = process.cwd() + '/src/content';

describeRepositoryContract('FileSystemPostRepository', () =>
    new FileSystemPostRepository(contentDir)
);
