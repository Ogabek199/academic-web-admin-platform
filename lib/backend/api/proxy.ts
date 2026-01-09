/**
 * Proxy API helper functions
 * API endpoint-larni yashirish uchun proxy orqali so'rov yuborish
 */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ProxyRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

/**
 * Proxy orqali API so'rov yuborish
 * @param endpoint - Proxy endpoint (masalan: 'public/profiles', 'auth/login')
 * @param options - Request options
 * @returns Promise<Response>
 *
 * @example
 * // GET so'rov
 * const response = await proxyRequest('public/profiles');
 *
 * @example
 * // POST so'rov
 * const response = await proxyRequest('auth/login', {
 *   method: 'POST',
 *   body: { username: 'admin', password: 'pass' }
 * });
 */
export async function proxyRequest(
  endpoint: string,
  options: ProxyRequestOptions = {}
): Promise<Response> {
  const { method = "GET", body, headers = {} } = options;

  const url = `/api/proxy/${endpoint}`;

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  return fetch(url, requestOptions);
}

/**
 * Proxy orqali JSON ma'lumot olish
 * @param endpoint - Proxy endpoint
 * @param options - Request options
 * @returns Promise<T>
 */
export async function proxyGet<T = unknown>(
  endpoint: string,
  queryParams?: Record<string, string>
): Promise<T> {
  let url = `/api/proxy/${endpoint}`;

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Xatolik" }));
    throw new Error(error.error || "So'rov muvaffaqiyatsiz");
  }

  return response.json();
}

/**
 * Proxy orqali POST so'rov yuborish
 * @param endpoint - Proxy endpoint
 * @param body - Request body
 * @returns Promise<T>
 */
export async function proxyPost<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`/api/proxy/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Xatolik" }));
    throw new Error(error.error || "So'rov muvaffaqiyatsiz");
  }

  return response.json();
}

/**
 * Proxy orqali PUT so'rov yuborish
 * @param endpoint - Proxy endpoint
 * @param body - Request body
 * @returns Promise<T>
 */
export async function proxyPut<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`/api/proxy/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Xatolik" }));
    throw new Error(error.error || "Xatolik");
  }

  return response.json();
}

/**
 * Proxy orqali DELETE so'rov yuborish
 * @param endpoint - Proxy endpoint
 * @returns Promise<T>
 */
export async function proxyDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetch(`/api/proxy/${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Xatolik" }));
    throw new Error(error.error || "Xatolik");
  }

  return response.json();
}
