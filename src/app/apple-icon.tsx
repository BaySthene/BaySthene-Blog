import { ImageResponse } from 'next/og';

export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #6750a4 0%, #8c52ff 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 36,
                    fontFamily: 'system-ui',
                }}
            >
                <span
                    style={{
                        fontSize: 100,
                        fontWeight: 'bold',
                        color: 'white',
                    }}
                >
                    B
                </span>
            </div>
        ),
        {
            ...size,
        }
    );
}
