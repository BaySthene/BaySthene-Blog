/**
 * Tag Value Object
 *
 * Represents a validated blog post tag.
 * Immutable and self-validating.
 */
export class Tag {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    /**
     * Creates a new Tag from a string value.
     * @throws Error if the tag is invalid
     */
    static create(value: string): Tag {
        const trimmed = value.trim();
        if (!Tag.isValid(trimmed)) {
            throw new InvalidTagError(trimmed);
        }
        return new Tag(trimmed);
    }

    /**
     * Creates a Tag from an existing valid string (unsafe - use only when loading from persistence)
     */
    static fromPersistence(value: string): Tag {
        return new Tag(value);
    }

    /**
     * Validates a tag string
     */
    static isValid(value: string): boolean {
        if (!value || value.trim().length === 0) return false;
        if (value.length > 50) return false;
        return true;
    }

    get value(): string {
        return this._value;
    }

    /**
     * Case-insensitive equality comparison
     */
    equals(other: Tag): boolean {
        return this._value.toLowerCase() === other._value.toLowerCase();
    }

    /**
     * Returns lowercase version for URL-safe usage
     */
    toUrlSafe(): string {
        return encodeURIComponent(this._value.toLowerCase());
    }

    toString(): string {
        return this._value;
    }
}

export class InvalidTagError extends Error {
    constructor(value: string) {
        super(`Invalid tag: "${value}". Tags must be non-empty and max 50 characters.`);
        this.name = 'InvalidTagError';
    }
}
