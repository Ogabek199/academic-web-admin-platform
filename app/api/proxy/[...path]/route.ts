import { NextRequest, NextResponse } from "next/server";

// API endpoint mapping - haqiqiy API-larni yashirish uchun
const API_MAP: Record<string, string> = {
  // Public APIs
  "public/profiles": "/api/public/profiles",
  "public/profile": "/api/public/profiles",
  "public/carousel": "/api/public/carousel",
  "public/publications": "/api/public/publications",

  // Auth APIs
  "auth/login": "/api/auth/login",
  "auth/logout": "/api/auth/logout",
  "auth/register": "/api/auth/register",
  "auth/me": "/api/auth/me",

  // Admin APIs
  "admin/profile": "/api/admin/profile",
  "admin/publications": "/api/admin/publications",
  "admin/upload": "/api/admin/upload",

  // Telegram APIs
  "telegram/send": "/api/telegram/send",
  "telegram/chat-id": "/api/telegram/get-chat-id",

  // Init API
  init: "/api/init",
};

/**
 * Proxy API - barcha API so'rovlarini yashirish uchun
 * Foydalanish: /api/proxy/{endpoint}
 * Masalan: /api/proxy/public/profiles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params, "PATCH");
}

async function handleProxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    // Path ni birlashtirish
    const proxyPath = params.path.join("/");

    // API mapping dan haqiqiy endpoint ni topish
    let targetPath = API_MAP[proxyPath];

    // Agar mapping da yo'q bo'lsa, to'g'ridan-to'g'ri path ni ishlatish
    // (masalan, dynamic routes uchun: public/profile/123)
    if (!targetPath) {
      // Dynamic route ni tekshirish (masalan: public/profile/[userId])
      if (proxyPath.startsWith("public/profile/")) {
        const userId = proxyPath.replace("public/profile/", "");
        targetPath = `/api/public/profiles/${userId}`;
      } else {
        // Mapping da yo'q bo'lsa, xato qaytarish
        return NextResponse.json(
          { error: "API endpoint topilmadi", path: proxyPath },
          { status: 404 }
        );
      }
    }

    // URL ni yaratish
    const baseUrl = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${baseUrl}${targetPath}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Request body ni olish
    let body: unknown = null;
    if (method !== "GET" && method !== "DELETE") {
      try {
        body = await request.json();
      } catch {
        // Body bo'sh bo'lishi mumkin
        body = null;
      }
    }

    // Headers ni olish (cookie va boshqalar)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Cookie-larni o'tkazish
    const cookies = request.headers.get("cookie");
    if (cookies) {
      headers["Cookie"] = cookies;
    }

    // Forward request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Response ni olish
    const data = await response.json();

    // Response ni qaytarish (status code bilan)
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy xatolik", message: "Noma'lum xatolik" },
      { status: 500 }
    );
  }
}
