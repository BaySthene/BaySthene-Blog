import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: true
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle root path explicitly
    if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // Match root
        '/',
        // Match all locale paths
        '/(tr|en)/:path*',
        // Match all pathnames except for api, _next, and static files
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
