/**
 * Slug Value Object
 *
 * Represents a validated URL-friendly identifier for blog posts.
 * Immutable and self-validating.
 */
export class Slug {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    /**
     * Creates a new Slug from a string value.
     * @throws Error if the slug is invalid
     */
    static create(value: string): Slug {
        const trimmed = value.trim().toLowerCase();
        if (!Slug.isValid(trimmed)) {
            throw new InvalidSlugError(value);
        }
        return new Slug(trimmed);
    }

    /**
     * Creates a Slug from an existing valid string (unsafe - use only when loading from persistence)
     */
    static fromPersistence(value: string): Slug {
        return new Slug(value);
    }

    /**
     * Validates a slug string
     * Valid slugs: lowercase alphanumeric with hyphens, no leading/trailing hyphens
     */
    static isValid(value: string): boolean {
        if (!value || value.length === 0) return false;
        if (value.length > 200) return false;
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
    }

    get value(): string {
        return this._value;
    }

    equals(other: Slug): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}

export class InvalidSlugError extends Error {
    constructor(value: string) {
        super(`Invalid slug: "${value}". Slugs must be lowercase alphanumeric with hyphens.`);
        this.name = 'InvalidSlugError';
    }
}
