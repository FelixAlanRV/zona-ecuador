/**
 * API Client Utilities
 * Handles basePath prefixing for API calls in subdirectory deployments
 */

// Get basePath from Next.js config at build time
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Creates an API URL with the correct basePath prefix
 * @param endpoint - API endpoint starting with /api/
 * @returns Full API URL with basePath prefix
 * 
 * @example
 * apiUrl('/api/comprobantes') // => '/facturacion-mx-app/api/comprobantes' (in production)
 * apiUrl('/api/comprobantes') // => '/api/comprobantes' (in local development)
 */
export function apiUrl(endpoint: string): string {
  if (!endpoint.startsWith('/')) {
    console.warn(`API endpoint should start with /: ${endpoint}`);
    endpoint = `/${endpoint}`;
  }
  return `${basePath}${endpoint}`;
}

/**
 * Fetch wrapper that automatically prepends basePath to API calls
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @returns Fetch promise
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(apiUrl(endpoint), options);
}
