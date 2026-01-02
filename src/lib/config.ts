/**
 * Site Configuration Types
 */

interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    cv?: string;
}

interface Author {
    name: string;
    avatar: string;
    bio: string;
    links: SocialLinks;
}

interface SiteConfig {
    title: string;
    description: string;
    siteUrl: string;
    author: Author;
    about: {
        title: string;
        description: string;
    };
    skills: string[];
}

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
            twitter: 'https://twitter.com/BaySthene',
            cv: '/baysthene-cv.pdf',
        },
    },
    about: {
        title: 'Merhaba! 👋',
        description: 'Ben yazılım geliştirme tutkunu bir geliştiriciyim. Bu blogda yazılım, teknoloji ve öğrendiklerimi paylaşıyorum. Amacım, karmaşık konuları herkesin anlayabileceği şekilde açıklamak ve toplulukla bilgi paylaşmak.',
    },
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', '.NET', 'C#', 'SQL', 'DevOps'],
};

