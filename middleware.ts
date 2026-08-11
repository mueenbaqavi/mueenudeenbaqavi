import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;

  const isAdminPage = path.startsWith("/admin");
  const isAuthPage = path.startsWith("/login");

  if (!isAdminPage && !isAuthPage) {
    return NextResponse.next();
  }

  if (!url || !anonKey) {
    if (isAdminPage) {
      return new NextResponse("Authentication Error: Supabase Environment Variables are not configured.", { status: 500 });
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (isAuthPage && data.user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    const setCookies = supabaseResponse.headers.getSetCookie();
    setCookies.forEach((cookie) => {
      redirectResponse.headers.append("Set-Cookie", cookie);
    });
    redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return redirectResponse;
  }

  if (isAdminPage && !data.user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    const setCookies = supabaseResponse.headers.getSetCookie();
    setCookies.forEach((cookie) => {
      redirectResponse.headers.append("Set-Cookie", cookie);
    });
    redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return redirectResponse;
  }

  supabaseResponse.headers.set("Cache-Control", "no-store, max-age=0");
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sitemap.xml|robots.txt).*)"
  ],
};
