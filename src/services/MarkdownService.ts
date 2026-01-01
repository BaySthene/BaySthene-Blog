import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

export class MarkdownService {
    static async toHtml(markdown: string): Promise<string> {
        if (!markdown) return '';

        try {
            const result = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypeHighlight, { detect: true })
                .use(rehypeStringify)
                .process(markdown);

            return result.toString();
        } catch (error) {
            console.error('Markdown processing error:', error);
            // Return raw markdown or empty string as fallback, 
            // depending on safety requirements. For valid HTML output, empty is safer.
            return '';
        }
    }

    static calculateReadingTime(content: string): number {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }
}
