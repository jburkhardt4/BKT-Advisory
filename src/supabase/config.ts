// Pure helpers for resolving and validating Supabase client credentials.
// Kept free of `import.meta.env` and client creation so vite.config.ts can
// reuse them to fail the build on a malformed key.

type EnvRecord = Record<string, string | boolean | undefined>;

export interface ResolvedSupabaseEnv {
  url: string | undefined;
  anonKey: string | undefined;
  urlVarName: string;
  anonKeyVarName: string;
}

function readEnv(env: EnvRecord, name: string): string | undefined {
  const value = env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Prefer explicit LOCAL/CLOUD names; fall back to the legacy names. Empty
 * values fall through (an empty Vercel var should not shadow the legacy one).
 */
export function resolveSupabaseEnv(env: EnvRecord, isProduction: boolean): ResolvedSupabaseEnv {
  const suffix = isProduction ? 'CLOUD' : 'LOCAL';
  const urlVarName = readEnv(env, `VITE_SUPABASE_URL_${suffix}`)
    ? `VITE_SUPABASE_URL_${suffix}`
    : 'VITE_SUPABASE_URL';
  const anonKeyVarName = readEnv(env, `VITE_SUPABASE_ANON_KEY_${suffix}`)
    ? `VITE_SUPABASE_ANON_KEY_${suffix}`
    : 'VITE_SUPABASE_ANON_KEY';

  return {
    url: readEnv(env, urlVarName),
    anonKey: readEnv(env, anonKeyVarName),
    urlVarName,
    anonKeyVarName,
  };
}

export function getSupabaseProjectRef(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const projectRef = hostname.split('.')[0];
    if (!projectRef) {
      throw new Error('Unable to determine Supabase project ref from URL.');
    }
    return projectRef;
  } catch {
    throw new Error(`Invalid Supabase URL: ${url}`);
  }
}

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const PUBLISHABLE_KEY_PATTERN = /^sb_publishable_[A-Za-z0-9_-]+$/;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal']);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4);
    // atob is global in browsers and Node 16+, so this also runs in vite.config.ts.
    const payload: unknown = JSON.parse(atob(padded));
    return payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Returns a human-readable problem with the anon/publishable key, or null when
 * it looks usable. Never echoes the key itself.
 */
export function getSupabaseKeyProblem(url: string, key: string): string | null {
  if (PUBLISHABLE_KEY_PATTERN.test(key)) return null;
  if (key.startsWith('sb_secret_')) {
    return 'a secret key was supplied; browser builds must use the anon or publishable key';
  }
  if (!JWT_PATTERN.test(key)) {
    return 'the key is not a valid JWT or sb_publishable_ key (check for stray characters or a missing line break)';
  }

  const payload = decodeJwtPayload(key);
  if (!payload) return 'the key payload could not be decoded';
  if (payload.role === 'service_role') {
    return 'a service_role key was supplied; browser builds must use the anon key';
  }

  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return `the Supabase URL is invalid: ${url}`;
  }
  // Local Supabase stacks issue keys without a project ref.
  if (LOCAL_HOSTS.has(hostname)) return null;

  const projectRef = getSupabaseProjectRef(url);
  if (typeof payload.ref === 'string' && payload.ref !== projectRef) {
    return `the key belongs to project "${payload.ref}" but the URL points to "${projectRef}"`;
  }
  return null;
}
