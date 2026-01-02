/**
 * Content Parser Port Interface
 *
 * Defines the contract for parsing raw content to HTML.
 * Implementation details (markdown, MDX, etc.) are hidden.
 */
export interface IContentParser {
    /**
     * Parses raw content to HTML
     */
    toHtml(content: string): Promise<string>;
}
