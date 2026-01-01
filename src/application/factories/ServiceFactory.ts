import { IPostRepository } from '@/domain/blog';
import { FileSystemPostRepository } from '@/infrastructure/persistence';
import {
    GetPostBySlug,
    GetAllPosts,
    SearchPosts,
    GetPostsByTag,
    GetAllTags,
    GetAllSlugs,
} from '../blog';

/**
 * Blog Services Container
 *
 * Contains all use cases for blog functionality.
 */
export interface BlogServices {
    getPostBySlug: GetPostBySlug;
    getAllPosts: GetAllPosts;
    searchPosts: SearchPosts;
    getPostsByTag: GetPostsByTag;
    getAllTags: GetAllTags;
    getAllSlugs: GetAllSlugs;
    repository: IPostRepository;
}

/**
 * Service Factory
 *
 * Composition root for dependency injection.
 * Creates all services with their dependencies wired up.
 */
export class ServiceFactory {
    private static instance: BlogServices | null = null;
    private static contentDir = process.cwd() + '/src/content';

    /**
     * Gets or creates the blog services singleton.
     * Uses file system repository by default.
     */
    static getBlogServices(): BlogServices {
        if (!ServiceFactory.instance) {
            const repository = new FileSystemPostRepository(ServiceFactory.contentDir);

            ServiceFactory.instance = {
                getPostBySlug: new GetPostBySlug(repository),
                getAllPosts: new GetAllPosts(repository),
                searchPosts: new SearchPosts(repository),
                getPostsByTag: new GetPostsByTag(repository),
                getAllTags: new GetAllTags(repository),
                getAllSlugs: new GetAllSlugs(repository),
                repository,
            };
        }
        return ServiceFactory.instance;
    }

    /**
     * Creates blog services with a custom repository.
     * Useful for testing with mocks.
     */
    static createBlogServices(repository: IPostRepository): BlogServices {
        return {
            getPostBySlug: new GetPostBySlug(repository),
            getAllPosts: new GetAllPosts(repository),
            searchPosts: new SearchPosts(repository),
            getPostsByTag: new GetPostsByTag(repository),
            getAllTags: new GetAllTags(repository),
            getAllSlugs: new GetAllSlugs(repository),
            repository,
        };
    }

    /**
     * Resets the singleton (for testing).
     */
    static reset(): void {
        ServiceFactory.instance = null;
    }
}
