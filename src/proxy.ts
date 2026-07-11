import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["it", "en", "de", "es", "tr"];
const defaultLocale = "it";

function getPreferredLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") || "";
  for (const locale of locales) {
    if (acceptLang.toLowerCase().includes(locale)) return locale;
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".") // static files like favicon.ico
  ) {
    // Admin auth check
    if (
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/login")
    ) {
      const response = NextResponse.next();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return response;
    }

    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale-prefixed URL
  const locale = getPreferredLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
