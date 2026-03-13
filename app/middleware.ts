/**
 * i18n middleware for locale routing
 * Handles: /zh-CN/*, /en/*, redirect to default locale
 */

import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './lib/i18n.config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname starts with supported locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale if no locale in pathname
  // Exception: API routes, health checks, etc.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Get preferred locale from accept-language header or default
  const locale = getLocaleFromRequest(request) || defaultLocale;

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

/**
 * Extract preferred locale from Accept-Language header
 */
function getLocaleFromRequest(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) {
    return null;
  }

  // Parse accept-language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      const baseLang = code.split('-')[0];
      return { code: baseLang, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const lang of languages) {
    if (locales.some(locale => locale.startsWith(lang.code))) {
      // Map language codes to supported locales
      if (lang.code === 'zh') return 'zh-CN';
      if (lang.code === 'en') return 'en';
    }
  }

  return null;
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    // Match all pathnames except:
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
