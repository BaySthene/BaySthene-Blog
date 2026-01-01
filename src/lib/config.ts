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
            twitter: 'https://twitter.com/BaySthene', // Added based on page.tsx
            cv: '/baysthene-cv.pdf',
        },
    },
    about: {
        title: 'Merhaba! 👋',
        description: 'Ben yazılım geliştirme tutkunu bir geliştiriciyim. Bu blogda yazılım, teknoloji ve öğrendiklerimi paylaşıyorum. Amacım, karmaşık konuları herkesin anlayabileceği şekilde açıklamak ve toplulukla bilgi paylaşmak.',
    },
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', '.NET', 'C#', 'SQL', 'DevOps'],
};
