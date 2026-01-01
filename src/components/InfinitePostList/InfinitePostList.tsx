'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import BlogCard from '@/components/BlogCard';
import { BlogPostMeta } from '@/lib/types';
import styles from './InfinitePostList.module.css';
import {useTranslations} from "next-intl";

interface InfinitePostListProps {
    initialPosts: BlogPostMeta[];
    query?: string;
    postsPerPage?: number;
}

export default function InfinitePostList({
    initialPosts,
    query,
    postsPerPage = 6
}: InfinitePostListProps) {
    const [posts, setPosts] = useState<BlogPostMeta[]>(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialPosts.length >= postsPerPage);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('blog');

    const loadMorePosts = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const nextPage = page + 1;

        try {
            const params = new URLSearchParams({
                page: nextPage.toString(),
                limit: postsPerPage.toString(),
            });
            if (query) params.set('q', query);

            const response = await fetch(`/api/posts?${params}`);
            const data = await response.json();

            if (data.posts.length > 0) {
                setPosts((prev) => [...prev, ...data.posts]);
                setPage(nextPage);
                setHasMore(data.pagination.hasMore);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, isLoading, query, postsPerPage]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [loadMorePosts, hasMore, isLoading]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {posts.map((post, index) => (
                    <div
                        key={post.slug}
                        className={styles.cardWrapper}
                        style={{ animationDelay: `${(index % postsPerPage) * 50}ms` }}
                    >
                        <BlogCard post={post} />
                    </div>
                ))}
            </div>

            {/* Loading indicator / Observer target */}
            <div ref={observerRef} className={styles.loadingContainer}>
                {isLoading && (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                        <span>{t('loadingMore')}</span>
                    </div>
                )}
                {!hasMore && posts.length > postsPerPage && (
                    <div className={styles.endMessage}>
                        <span>🎉</span>
                        <p>{t('haveSeenAllTheWritings')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
