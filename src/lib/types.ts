// Blog Post Types

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readingTime: number;
  tags: string[];
  author: Author;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readingTime: number;
  tags: string[];
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  links: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  cv?: string;
}

// Site Configuration
export interface SiteConfig {
  title: string;
  description: string;
  siteUrl: string;
  author: Author;
}
