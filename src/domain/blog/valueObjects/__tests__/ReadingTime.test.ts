import { describe, it, expect } from 'vitest';
import { ReadingTime } from '../ReadingTime';

describe('ReadingTime Value Object', () => {
    describe('fromContent', () => {
        it('should calculate 1 minute for short content', () => {
            const content = 'Hello world'; // 2 words
            const readingTime = ReadingTime.fromContent(content);
            expect(readingTime.minutes).toBe(1);
        });

        it('should calculate reading time based on word count', () => {
            // 200 words = 1 minute at default WPM
            const words = Array(400).fill('word').join(' ');
            const readingTime = ReadingTime.fromContent(words);
            expect(readingTime.minutes).toBe(2);
        });

        it('should round up to nearest minute', () => {
            // 250 words = 1.25 minutes -> 2 minutes
            const words = Array(250).fill('word').join(' ');
            const readingTime = ReadingTime.fromContent(words);
            expect(readingTime.minutes).toBe(2);
        });

        it('should return 1 minute for empty content', () => {
            const readingTime = ReadingTime.fromContent('');
            expect(readingTime.minutes).toBe(1);
        });

        it('should accept custom words per minute', () => {
            const words = Array(300).fill('word').join(' ');
            const readingTime = ReadingTime.fromContent(words, 100);
            expect(readingTime.minutes).toBe(3);
        });
    });

    describe('fromMinutes', () => {
        it('should create reading time from minute value', () => {
            const readingTime = ReadingTime.fromMinutes(5);
            expect(readingTime.minutes).toBe(5);
        });

        it('should throw error for value less than 1', () => {
            expect(() => ReadingTime.fromMinutes(0)).toThrow();
        });

        it('should ceil decimal values', () => {
            const readingTime = ReadingTime.fromMinutes(2.3);
            expect(readingTime.minutes).toBe(3);
        });
    });

    describe('format', () => {
        it('should format in Turkish', () => {
            const readingTime = ReadingTime.fromMinutes(5);
            expect(readingTime.format('tr')).toBe('5 dk okuma');
        });

        it('should format in English', () => {
            const readingTime = ReadingTime.fromMinutes(5);
            expect(readingTime.format('en')).toBe('5 min read');
        });
    });

    describe('formatShort', () => {
        it('should format short in Turkish', () => {
            const readingTime = ReadingTime.fromMinutes(3);
            expect(readingTime.formatShort('tr')).toBe('3 dk');
        });

        it('should format short in English', () => {
            const readingTime = ReadingTime.fromMinutes(3);
            expect(readingTime.formatShort('en')).toBe('3 min');
        });
    });

    describe('equals', () => {
        it('should return true for equal reading times', () => {
            const rt1 = ReadingTime.fromMinutes(5);
            const rt2 = ReadingTime.fromMinutes(5);
            expect(rt1.equals(rt2)).toBe(true);
        });

        it('should return false for different reading times', () => {
            const rt1 = ReadingTime.fromMinutes(5);
            const rt2 = ReadingTime.fromMinutes(10);
            expect(rt1.equals(rt2)).toBe(false);
        });
    });
});
