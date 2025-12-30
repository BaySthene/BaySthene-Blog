import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BaySthene Blog';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'rgba(103, 80, 164, 0.3)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(140, 82, 255, 0.2)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #6750a4 0%, #8c52ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 40,
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        B
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #ffffff 0%, #a0a0ff 100%)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: 16,
                    }}
                >
                    BaySthene Blog
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 28,
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    Yazılım, Teknoloji ve Daha Fazlası
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
