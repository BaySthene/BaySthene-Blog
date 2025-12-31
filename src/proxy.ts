import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, type Locale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'NEXT_LOCALE';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: true
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle root path - check cookie for preferred locale
    if (pathname === '/') {
        const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
        const targetLocale = cookieLocale && locales.includes(cookieLocale)
            ? cookieLocale
            : defaultLocale;

        const response = NextResponse.redirect(new URL(`/${targetLocale}`, request.url));

        // Set cookie if not already set
        if (!cookieLocale) {
            response.cookies.set(LOCALE_COOKIE, targetLocale, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
            });
        }

        return response;
    }

    // For locale paths, set cookie to remember the choice
    const localeMatch = pathname.match(/^\/(tr|en)(?:\/|$)/);
    if (localeMatch) {
        const pathLocale = localeMatch[1] as Locale;
        const currentCookie = request.cookies.get(LOCALE_COOKIE)?.value;

        // If the user is visiting a different locale, update the cookie
        if (currentCookie !== pathLocale) {
            const response = intlMiddleware(request);
            response.cookies.set(LOCALE_COOKIE, pathLocale, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
            });
            return response;
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
