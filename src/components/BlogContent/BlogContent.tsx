'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BlogContent.module.css';

interface BlogContentProps {
    html: string;
}

export default function BlogContent({ html }: BlogContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const preElements = contentRef.current.querySelectorAll('pre');

        preElements.forEach((pre, index) => {
            // Skip if already has a copy button
            if (pre.querySelector('.copy-btn')) return;

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = styles.codeWrapper;

            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = `${styles.copyButton} copy-btn`;
            copyBtn.setAttribute('aria-label', 'Kodu kopyala');
            copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <span>Kopyala</span>
      `;

            copyBtn.addEventListener('click', async () => {
                const code = pre.querySelector('code');
                const text = code?.textContent || pre.textContent || '';

                try {
                    await navigator.clipboard.writeText(text);
                    copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Kopyalandı!</span>
          `;
                    copyBtn.classList.add(styles.copied);

                    setTimeout(() => {
                        copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              <span>Kopyala</span>
            `;
                        copyBtn.classList.remove(styles.copied);
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });

            // Wrap pre element
            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(copyBtn);
        });
    }, [html]);

    return (
        <div
            ref={contentRef}
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
