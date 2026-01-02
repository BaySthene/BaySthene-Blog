/**
 * ReadingTime Value Object
 *
 * Represents the estimated reading time for a blog post.
 * Immutable and self-validating.
 */
export class ReadingTime {
    private static readonly DEFAULT_WORDS_PER_MINUTE = 200;
    private readonly _minutes: number;

    private constructor(minutes: number) {
        this._minutes = minutes;
    }

    /**
     * Calculates reading time from content
     */
    static fromContent(content: string, wordsPerMinute = ReadingTime.DEFAULT_WORDS_PER_MINUTE): ReadingTime {
        if (!content || content.trim().length === 0) {
            return new ReadingTime(1);
        }
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
        return new ReadingTime(minutes);
    }

    /**
     * Creates from a known minute value
     */
    static fromMinutes(minutes: number): ReadingTime {
        if (minutes < 1) {
            throw new Error('Reading time must be at least 1 minute');
        }
        return new ReadingTime(Math.ceil(minutes));
    }

    /**
     * Creates from persistence (no validation)
     */
    static fromPersistence(minutes: number): ReadingTime {
        return new ReadingTime(minutes);
    }

    get minutes(): number {
        return this._minutes;
    }

    /**
     * Formats reading time for display
     */
    format(locale: 'en' | 'tr'): string {
        return locale === 'tr'
            ? `${this._minutes} dk okuma`
            : `${this._minutes} min read`;
    }

    /**
     * Short format for compact display
     */
    formatShort(locale: 'en' | 'tr'): string {
        return locale === 'tr'
            ? `${this._minutes} dk`
            : `${this._minutes} min`;
    }

    equals(other: ReadingTime): boolean {
        return this._minutes === other._minutes;
    }

    toString(): string {
        return `${this._minutes} min`;
    }
}
