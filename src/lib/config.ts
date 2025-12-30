import { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
    title: 'BaySthene Blog',
    description: 'Kişisel blog ve yazılarım',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://baysthene.com',
    author: {
        name: 'Muhammet Keskin',
        avatar: '/baysthene.jpg',
        bio: 'Full Stack Software Developer',
        links: {
            github: 'https://github.com/BaySthene',
            linkedin: 'https://www.linkedin.com/in/muhammet-keskin-187550255/',
            cv: '/baysthene-cv.pdf',
        },
    },
};
