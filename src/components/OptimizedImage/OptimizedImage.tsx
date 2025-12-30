'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getShimmerPlaceholder } from '@/lib/image';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
    shimmer?: boolean;
}

export default function OptimizedImage({
    shimmer = true,
    className,
    alt,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Get dimensions for shimmer
    const width = typeof props.width === 'number' ? props.width : 700;
    const height = typeof props.height === 'number' ? props.height : 475;

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <div
                className={`${styles.fallback} ${className || ''}`}
                style={{ aspectRatio: `${width} / ${height}` }}
            >
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                <span>Görsel yüklenemedi</span>
            </div>
        );
    }

    return (
        <div className={`${styles.wrapper} ${isLoaded ? styles.loaded : ''} ${className || ''}`}>
            <Image
                {...props}
                alt={alt}
                placeholder={shimmer ? 'blur' : 'empty'}
                blurDataURL={shimmer ? getShimmerPlaceholder(width, height) : undefined}
                onLoad={handleLoad}
                onError={handleError}
                className={styles.image}
            />
        </div>
    );
}
