'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { SearchIcon } from '@/components/Icons';
import styles from './SearchBar.module.css';
import { BlogPostMeta } from '@/lib/types';
import { useLocale, useTranslations } from "next-intl";

interface SearchBarProps {
    placeholder?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function SearchBar({ placeholder = 'Blog yazılarında ara...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<BlogPostMeta[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const t = useTranslations('search');

    const debouncedQuery = useDebounce(query, 300);

    // Search when debounced query changes
    useEffect(() => {
        const searchPosts = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await response.json();
                setResults(data);
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchPosts();
    }, [debouncedQuery]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setQuery('');
            setResults([]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const selectedPost = results[selectedIndex];
            if (selectedPost) {
                window.location.href = `/blog/${selectedPost.slug}`;
            }
        }
    }, [results, selectedIndex]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);


    return (
        <div className={styles.container}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setIsOpen(true)}
                aria-label={placeholder}
            >
                <SearchIcon size={20} />
                <span className={styles.triggerText}>{placeholder}</span>
                <kbd className={styles.shortcut}>⌘K</kbd>
            </button>

            {isOpen && (
                <>
                    <div className={styles.backdrop} onClick={handleClose} />
                    <div className={styles.modal}>
                        <div className={styles.form}>
                            <SearchIcon size={24} className={styles.searchIcon} />
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className={styles.input}
                                autoComplete="off"
                            />
                            {isLoading && (
                                <div className={styles.spinner} aria-label={t('loading')} />
                            )}
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={handleClose}
                                aria-label={t('close')}
                            >
                                <kbd>ESC</kbd>
                            </button>
                        </div>

                        {/* Search Results */}
                        {(results.length > 0 || (query && !isLoading)) && (
                            <div className={styles.results} ref={resultsRef}>
                                {results.length > 0 ? (
                                    results.map((post, index) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                                            onClick={handleClose}
                                        >
                                            <div className={styles.resultContent}>
                                                <h4 className={styles.resultTitle}>{post.title}</h4>
                                                <p className={styles.resultExcerpt}>{post.excerpt}</p>
                                            </div>
                                            <div className={styles.resultMeta}>
                                                <span className={styles.resultDate}>
                                                    {new Date(post.date).toLocaleDateString(
                                                        locale === 'tr' ? 'tr-TR' : 'en-US',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        }
                                                    )}
                                                </span>
                                                <span className={styles.resultTime}>{post.readingTime} {t('readingTime')}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className={styles.noResults}>
                                        <span className={styles.noResultsIcon}>
                                            <SearchIcon size={24} className={styles.searchIcon} />
                                        </span>
                                        <p>{t('noResults', { query })}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quick Tips */}
                        {!query && (
                            <div className={styles.tips}>
                                <div className={styles.tip}>
                                    <kbd>↑</kbd><kbd>↓</kbd>
                                    <span>{t('tips.navigate')}</span>
                                </div>
                                <div className={styles.tip}>
                                    <kbd>Enter</kbd>
                                    <span>{t('tips.select')}</span>
                                </div>
                                <div className={styles.tip}>
                                    <kbd>ESC</kbd>
                                    <span>{t('tips.close')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
