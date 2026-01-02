import { describe, it, expect } from 'vitest';
import { Tag, InvalidTagError } from '../Tag';

describe('Tag Value Object', () => {
    describe('create', () => {
        it('should create a valid tag', () => {
            const tag = Tag.create('TypeScript');
            expect(tag.value).toBe('TypeScript');
        });

        it('should trim whitespace', () => {
            const tag = Tag.create('  React  ');
            expect(tag.value).toBe('React');
        });

        it('should throw InvalidTagError for empty string', () => {
            expect(() => Tag.create('')).toThrow(InvalidTagError);
        });

        it('should throw InvalidTagError for whitespace only', () => {
            expect(() => Tag.create('   ')).toThrow(InvalidTagError);
        });

        it('should throw InvalidTagError for string longer than 50 chars', () => {
            const longTag = 'a'.repeat(51);
            expect(() => Tag.create(longTag)).toThrow(InvalidTagError);
        });

        it('should accept tag with exactly 50 chars', () => {
            const tag = Tag.create('a'.repeat(50));
            expect(tag.value).toHaveLength(50);
        });
    });

    describe('equals', () => {
        it('should return true for case-insensitive equal tags', () => {
            const tag1 = Tag.create('TypeScript');
            const tag2 = Tag.create('typescript');
            expect(tag1.equals(tag2)).toBe(true);
        });

        it('should return false for different tags', () => {
            const tag1 = Tag.create('React');
            const tag2 = Tag.create('Vue');
            expect(tag1.equals(tag2)).toBe(false);
        });
    });

    describe('toUrlSafe', () => {
        it('should return lowercase url-encoded value', () => {
            const tag = Tag.create('Next.js');
            expect(tag.toUrlSafe()).toBe('next.js');
        });

        it('should encode special characters', () => {
            const tag = Tag.create('C#');
            expect(tag.toUrlSafe()).toBe('c%23');
        });
    });

    describe('toString', () => {
        it('should return the original tag value', () => {
            const tag = Tag.create('TypeScript');
            expect(tag.toString()).toBe('TypeScript');
        });
    });
});
