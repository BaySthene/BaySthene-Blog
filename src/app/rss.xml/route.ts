import { NextResponse } from 'next/server';
import { ServiceFactory } from '@/application/factories';
import { siteConfig } from '@/lib/config';

export async function GET() {
  const { getAllPosts } = ServiceFactory.getBlogServices();
  const domainPosts = await getAllPosts.execute();
  const baseUrl = siteConfig.siteUrl;

  const rssItems = domainPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug.value}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug.value}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${tag.value}</category>`).join('\n      ')}
    </item>`
    )
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${siteConfig.author.name}</managingEditor>
    <webMaster>${siteConfig.author.name}</webMaster>
    <image>
      <url>${baseUrl}${siteConfig.author.avatar}</url>
      <title>${siteConfig.title}</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
