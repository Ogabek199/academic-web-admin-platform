import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // HTTP dan HTTPS ga yo'naltirish (SSL mavjud bo'lganda)
  const proto = request.headers.get("x-forwarded-proto");
  if (proto === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/website",
    "/api/auth",
    "/api/public",
    "/search",
    "/profile",
    "/publications",
    "/statistics",
    "/about",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Barcha yo'llar (HTTP→HTTPS redirect) va /admin (auth tekshiruvi)
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
