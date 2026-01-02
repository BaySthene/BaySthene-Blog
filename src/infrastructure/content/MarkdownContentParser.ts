import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import type { IContentParser } from '@/domain/blog/ports';

/**
 * Markdown Content Parser
 *
 * Implements IContentParser using unified/remark/rehype pipeline.
 * Converts markdown to HTML with syntax highlighting.
 */
export class MarkdownContentParser implements IContentParser {
    async toHtml(content: string): Promise<string> {
        if (!content) return '';

        try {
            const result = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypeHighlight, { detect: true })
                .use(rehypeStringify)
                .process(content);

            return result.toString();
        } catch (error) {
            console.error('Markdown processing error:', error);
            return '';
        }
    }
}

/**
 * Default content parser instance
 */
export const defaultContentParser = new MarkdownContentParser();
