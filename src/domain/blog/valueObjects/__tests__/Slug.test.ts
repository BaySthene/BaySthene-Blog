import { describe, it, expect } from 'vitest';
import { Slug, InvalidSlugError } from '../Slug';

describe('Slug Value Object', () => {
    describe('create', () => {
        it('should create a valid slug from lowercase string', () => {
            const slug = Slug.create('hello-world');
            expect(slug.value).toBe('hello-world');
        });

        it('should normalize uppercase to lowercase', () => {
            const slug = Slug.create('Hello-World');
            expect(slug.value).toBe('hello-world');
        });

        it('should trim whitespace', () => {
            const slug = Slug.create('  hello-world  ');
            expect(slug.value).toBe('hello-world');
        });

        it('should create slug with numbers', () => {
            const slug = Slug.create('post-123');
            expect(slug.value).toBe('post-123');
        });

        it('should throw InvalidSlugError for empty string', () => {
            expect(() => Slug.create('')).toThrow(InvalidSlugError);
        });

        it('should throw InvalidSlugError for string with spaces', () => {
            expect(() => Slug.create('hello world')).toThrow(InvalidSlugError);
        });

        it('should throw InvalidSlugError for string with special characters', () => {
            expect(() => Slug.create('hello@world')).toThrow(InvalidSlugError);
        });

        it('should throw InvalidSlugError for leading hyphen', () => {
            expect(() => Slug.create('-hello')).toThrow(InvalidSlugError);
        });

        it('should throw InvalidSlugError for trailing hyphen', () => {
            expect(() => Slug.create('hello-')).toThrow(InvalidSlugError);
        });
    });

    describe('isValid', () => {
        it('should return true for valid slug', () => {
            expect(Slug.isValid('hello-world')).toBe(true);
        });

        it('should return true for slug with numbers', () => {
            expect(Slug.isValid('post-123')).toBe(true);
        });

        it('should return false for empty string', () => {
            expect(Slug.isValid('')).toBe(false);
        });

        it('should return false for string with spaces', () => {
            expect(Slug.isValid('hello world')).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for equal slugs', () => {
            const slug1 = Slug.create('hello-world');
            const slug2 = Slug.create('hello-world');
            expect(slug1.equals(slug2)).toBe(true);
        });

        it('should return false for different slugs', () => {
            const slug1 = Slug.create('hello');
            const slug2 = Slug.create('world');
            expect(slug1.equals(slug2)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return the slug value', () => {
            const slug = Slug.create('hello-world');
            expect(slug.toString()).toBe('hello-world');
        });
    });

    describe('fromPersistence', () => {
        it('should create slug without validation', () => {
            const slug = Slug.fromPersistence('existing-slug');
            expect(slug.value).toBe('existing-slug');
        });
    });
});
