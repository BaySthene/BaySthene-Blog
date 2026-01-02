import { Slug, Tag, ReadingTime } from '../valueObjects';

/**
 * BlogPost Entity
 *
 * Identity: slug (unique identifier)
 * Aggregate Root for blog post content
 *
 * This is a proper DDD Entity with:
 * - Identity via Slug
 * - Encapsulated state
 * - Domain behavior methods
 * - Factory method for persistence reconstruction
 */
export class BlogPost {
    private constructor(
        private readonly _slug: Slug,
        private readonly _title: string,
        private readonly _excerpt: string,
        private readonly _content: string,
        private readonly _coverImage: string,
        private readonly _date: Date,
        private readonly _readingTime: ReadingTime,
        private readonly _tags: readonly Tag[],
        private readonly _authorName: string
    ) { }

    // ─────────────────────────────────────────────────────────────
    // Factory Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Creates a BlogPost from persistence data
     * Used by repository implementations
     */
    static fromPersistence(data: {
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImage: string;
        date: Date;
        readingTimeMinutes: number;
        tags: string[];
        authorName: string;
    }): BlogPost {
        return new BlogPost(
            Slug.fromPersistence(data.slug),
            data.title,
            data.excerpt,
            data.content,
            data.coverImage,
            data.date,
            ReadingTime.fromPersistence(data.readingTimeMinutes),
            data.tags.map((t) => Tag.fromPersistence(t)),
            data.authorName
        );
    }

    /**
     * Creates a lightweight meta representation (without content)
     * Used for listings and search results
     */
    toMeta(): BlogPostMeta {
        return new BlogPostMeta(
            this._slug,
            this._title,
            this._excerpt,
            this._coverImage,
            this._date,
            this._readingTime,
            this._tags
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Identity
    // ─────────────────────────────────────────────────────────────

    /**
     * Returns the identity of this entity
     */
    get identity(): Slug {
        return this._slug;
    }

    // ─────────────────────────────────────────────────────────────
    // Getters (Immutable access)
    // ─────────────────────────────────────────────────────────────

    get slug(): Slug {
        return this._slug;
    }
    get title(): string {
        return this._title;
    }
    get excerpt(): string {
        return this._excerpt;
    }
    get content(): string {
        return this._content;
    }
    get coverImage(): string {
        return this._coverImage;
    }
    get date(): Date {
        return this._date;
    }
    get readingTime(): ReadingTime {
        return this._readingTime;
    }
    get readingTimeMinutes(): number {
        return this._readingTime.minutes;
    }
    get tags(): readonly Tag[] {
        return this._tags;
    }
    get authorName(): string {
        return this._authorName;
    }

    // ─────────────────────────────────────────────────────────────
    // Domain Behavior
    // ─────────────────────────────────────────────────────────────

    /**
     * Checks if this post has the given tag
     */
    hasTag(tag: Tag): boolean {
        return this._tags.some((t) => t.equals(tag));
    }

    /**
     * Checks if this post matches a search query
     * Searches in title, excerpt, and tags
     */
    matchesSearch(query: string): boolean {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return true;

        return (
            this._title.toLowerCase().includes(lowerQuery) ||
            this._excerpt.toLowerCase().includes(lowerQuery) ||
            this._tags.some((t) => t.value.toLowerCase().includes(lowerQuery))
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Equality
    // ─────────────────────────────────────────────────────────────

    /**
     * Two BlogPosts are equal if they have the same identity (slug)
     */
    equals(other: BlogPost): boolean {
        return this._slug.equals(other._slug);
    }
}

/**
 * BlogPostMeta - Lightweight representation without content
 *
 * Used for listings and search results where full content is not needed.
 * Immutable value-like object derived from BlogPost entity.
 */
export class BlogPostMeta {
    constructor(
        private readonly _slug: Slug,
        private readonly _title: string,
        private readonly _excerpt: string,
        private readonly _coverImage: string,
        private readonly _date: Date,
        private readonly _readingTime: ReadingTime,
        private readonly _tags: readonly Tag[]
    ) { }

    /**
     * Creates a BlogPostMeta from persistence data
     */
    static fromPersistence(data: {
        slug: string;
        title: string;
        excerpt: string;
        coverImage: string;
        date: Date;
        readingTimeMinutes: number;
        tags: string[];
    }): BlogPostMeta {
        return new BlogPostMeta(
            Slug.fromPersistence(data.slug),
            data.title,
            data.excerpt,
            data.coverImage,
            data.date,
            ReadingTime.fromPersistence(data.readingTimeMinutes),
            data.tags.map((t) => Tag.fromPersistence(t))
        );
    }

    // Getters
    get slug(): Slug {
        return this._slug;
    }
    get title(): string {
        return this._title;
    }
    get excerpt(): string {
        return this._excerpt;
    }
    get coverImage(): string {
        return this._coverImage;
    }
    get date(): Date {
        return this._date;
    }
    get readingTime(): ReadingTime {
        return this._readingTime;
    }
    get readingTimeMinutes(): number {
        return this._readingTime.minutes;
    }
    get tags(): readonly Tag[] {
        return this._tags;
    }

    /**
     * Checks if this post matches a search query
     */
    matchesSearch(query: string): boolean {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return true;

        return (
            this._title.toLowerCase().includes(lowerQuery) ||
            this._excerpt.toLowerCase().includes(lowerQuery) ||
            this._tags.some((t) => t.value.toLowerCase().includes(lowerQuery))
        );
    }
}
