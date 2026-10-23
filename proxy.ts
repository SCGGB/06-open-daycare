import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

const PUBLIC_ROUTES = ["/login", "/activar-cuenta"];

function getSafeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  if (value.includes("\\") || value === "/login" || value.startsWith("/login?")) {
    return "/";
  }

  return value;
}

function copySession(
  source: NextResponse,
  target: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) {
      target.headers.set(header, value);
    }
  }

  return target;
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, claims } = await updateSession(request);
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = Boolean(claims?.sub);
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublic) {
    const url = new URL("/login", request.url);

    if (pathname !== "/") {
      url.searchParams.set("next", `${pathname}${search}`);
    }

    return copySession(supabaseResponse, NextResponse.redirect(url));
  }

  if (isAuthenticated && pathname === "/login") {
    const next = getSafeNext(request.nextUrl.searchParams.get("next"));
    const url = new URL(next, request.url);

    return copySession(supabaseResponse, NextResponse.redirect(url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
