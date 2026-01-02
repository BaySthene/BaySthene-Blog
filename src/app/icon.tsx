import { ImageResponse } from 'next/og';

export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
                    borderRadius: 6,
                    fontFamily: 'system-ui',
                }}
            >
                <span
                    style={{
                        fontSize: 20,
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
