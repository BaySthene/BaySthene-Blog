'use client';

import { useEffect, useRef } from 'react';
import styles from './BlogContent.module.css';

interface BlogContentProps {
    html: string;
}

// Generate slug from heading text
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-zğüşıöç0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function BlogContent({ html }: BlogContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Add code copy buttons
        const preElements = contentRef.current.querySelectorAll('pre');
        preElements.forEach((pre) => {
            if (pre.querySelector('.copy-btn')) return;

            const wrapper = document.createElement('div');
            wrapper.className = styles.codeWrapper;

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

            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(copyBtn);
        });

        // Add anchor links to headings
        const headings = contentRef.current.querySelectorAll('h2, h3');
        headings.forEach((heading, index) => {
            if (heading.querySelector('.anchor-link')) return;

            const text = heading.textContent || '';
            const slug = generateSlug(text) || `heading-${index}`;

            // Set ID for navigation
            heading.id = slug;

            // Make heading a flex container
            heading.classList.add(styles.headingWithAnchor);

            // Create anchor link
            const anchor = document.createElement('a');
            anchor.href = `#${slug}`;
            anchor.className = `${styles.anchorLink} anchor-link`;
            anchor.setAttribute('aria-label', `${text} bölümüne bağlantı`);
            anchor.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
                </svg>
            `;

            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const offset = 100;
                const elementPosition = heading.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });

                // Update URL hash
                history.pushState(null, '', `#${slug}`);
            });

            heading.appendChild(anchor);
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
