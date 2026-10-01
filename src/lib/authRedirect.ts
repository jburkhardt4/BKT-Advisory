const DEFAULT_POST_AUTH_PATH = '/portal';

// Hash fragments Supabase/OAuth providers append on callback. They must never be
// replayed into a new redirect: they leak tokens and overflow provider URL limits.
const AUTH_HASH_PATTERN = /(access_token|refresh_token|provider_token|error_description|error_code|error)=/;

/**
 * Turns `location.state.from` into a safe in-app path to land on after sign-in.
 * Rejects non-paths, protocol-relative URLs, and the /auth page itself, and strips
 * OAuth callback fragments (e.g. `#access_token=...`).
 */
export function getPostAuthPath(from: unknown): string {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) {
    return DEFAULT_POST_AUTH_PATH;
  }

  const hashIndex = from.indexOf('#');
  const pathAndSearch = hashIndex === -1 ? from : from.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : from.slice(hashIndex);

  const pathname = pathAndSearch.split('?')[0];
  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    return DEFAULT_POST_AUTH_PATH;
  }

  return AUTH_HASH_PATTERN.test(hash) ? pathAndSearch : from;
}

/**
 * Absolute OAuth `redirectTo` for the current origin (local, preview, or
 * production). The hash is always dropped because Supabase appends its own.
 */
export function getOAuthRedirectUrl(from: unknown, origin: string = window.location.origin): string {
  const path = getPostAuthPath(from).split('#')[0];
  return `${origin}${path}`;
}
