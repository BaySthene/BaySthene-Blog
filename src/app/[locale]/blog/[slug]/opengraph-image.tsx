import { ImageResponse } from 'next/og';
import { ServiceFactory } from '@/application/factories';

export const alt = 'Blog Post';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { getPostBySlug } = ServiceFactory.getBlogServices();

    let title = 'Blog Post';
    let tags: string[] = [];

    try {
        const post = await getPostBySlug.execute(slug);
        if (post) {
            title = post.title;
            tags = post.tags.slice(0, 3).map(t => t.value);
        }
    } catch {
        // Use defaults
    }


    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 60,
                    fontFamily: 'system-ui',
                }}
            >
                {/* Decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: -80,
                        right: -80,
                        width: 350,
                        height: 350,
                        borderRadius: '50%',
                        background: 'rgba(103, 80, 164, 0.3)',
                        filter: 'blur(50px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -40,
                        left: 100,
                        width: 250,
                        height: 250,
                        borderRadius: '50%',
                        background: 'rgba(140, 82, 255, 0.2)',
                        filter: 'blur(50px)',
                    }}
                />

                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #6750a4 0%, #8c52ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        B
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 24 }}>
                        BaySthene Blog
                    </span>
                </div>

                {/* Title */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: title.length > 50 ? 48 : 56,
                            fontWeight: 'bold',
                            color: 'white',
                            lineHeight: 1.2,
                            maxWidth: '90%',
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                        }}
                    >
                        {tags.map((tag) => (
                            <div
                                key={tag}
                                style={{
                                    padding: '8px 20px',
                                    background: 'rgba(103, 80, 164, 0.3)',
                                    borderRadius: 20,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: 18,
                                }}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
        {
            ...size,
        }
    );
}
