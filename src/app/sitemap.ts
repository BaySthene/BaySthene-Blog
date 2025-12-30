import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.siteUrl;
    const posts = getAllPosts();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Blog post pages
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...blogPages];
}
