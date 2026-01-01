import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMeta } from '@/lib/types';
import { cache } from 'react';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content');

export class ContentRepository {
    private static ensureDirectory() {
        if (!fs.existsSync(POSTS_DIRECTORY)) {
            fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
        }
    }

    static getAllSlugs(): string[] {
        this.ensureDirectory();
        try {
            const fileNames = fs.readdirSync(POSTS_DIRECTORY);
            return fileNames
                .filter((fileName) => fileName.endsWith('.md'))
                .map((fileName) => fileName.replace(/\.md$/, ''));
        } catch {
            return [];
        }
    }

    static getPostRaw(slug: string): { content: string; data: any } | null {
        this.ensureDirectory();
        try {
            const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
            if (!fs.existsSync(fullPath)) return null;

            const fileContents = fs.readFileSync(fullPath, 'utf8');
            return matter(fileContents);
        } catch {
            return null;
        }
    }
}
