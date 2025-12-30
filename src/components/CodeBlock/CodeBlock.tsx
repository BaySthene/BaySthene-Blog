'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
    children: React.ReactNode;
}

export default function CodeBlock({ children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        if (!preRef.current) return;

        const codeElement = preRef.current.querySelector('code');
        const text = codeElement?.textContent || '';

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [copied]);

    return (
        <div className={styles.wrapper} ref={preRef}>
            {children}
            <button
                type="button"
                className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                onClick={handleCopy}
                aria-label={copied ? 'Kopyalandı' : 'Kodu kopyala'}
            >
                {copied ? (
                    <>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span>Kopyalandı</span>
                    </>
                ) : (
                    <>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                        <span>Kopyala</span>
                    </>
                )}
            </button>
        </div>
    );
}
