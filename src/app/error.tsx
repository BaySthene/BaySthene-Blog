'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                </div>

                <h1 className={styles.title}>Bir Şeyler Ters Gitti</h1>
                <p className={styles.description}>
                    Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
                </p>

                <div className={styles.actions}>
                    <button onClick={reset} className={styles.primaryButton}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                        Tekrar Dene
                    </button>

                    <a href="/" className={styles.secondaryButton}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                        Ana Sayfa
                    </a>
                </div>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <details className={styles.errorDetails}>
                        <summary>Hata Detayları</summary>
                        <pre>{error.message}</pre>
                        {error.digest && <p>Digest: {error.digest}</p>}
                    </details>
                )}
            </div>
        </div>
    );
}
