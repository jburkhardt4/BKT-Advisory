import { describe, it, expect } from 'vitest';
import { getOAuthRedirectUrl, getPostAuthPath } from '../lib/authRedirect';
import { getSupabaseKeyProblem, resolveSupabaseEnv } from '../supabase/config';

const URL_CLOUD = 'https://abcdefghijklmnop.supabase.co';

function makeJwt(payload: Record<string, unknown>): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.c2lnbmF0dXJl`;
}

describe('getPostAuthPath', () => {
  it('defaults to /portal for missing or unsafe values', () => {
    expect(getPostAuthPath(undefined)).toBe('/portal');
    expect(getPostAuthPath('https://evil.example')).toBe('/portal');
    expect(getPostAuthPath('//evil.example')).toBe('/portal');
    expect(getPostAuthPath('/auth?flow=recovery')).toBe('/portal');
  });

  it('keeps in-app paths, queries, and ordinary hashes', () => {
    expect(getPostAuthPath('/portal/admin?tab=deals')).toBe('/portal/admin?tab=deals');
    expect(getPostAuthPath('/portal#billing')).toBe('/portal#billing');
  });

  it('strips OAuth callback fragments', () => {
    expect(getPostAuthPath('/portal#access_token=abc&refresh_token=def')).toBe('/portal');
    expect(getPostAuthPath('/portal?x=1#error=access_denied')).toBe('/portal?x=1');
  });
});

describe('getOAuthRedirectUrl', () => {
  it('builds an absolute URL on the given origin without any hash', () => {
    expect(getOAuthRedirectUrl('/portal#access_token=abc', 'https://bktadvisory.com')).toBe(
      'https://bktadvisory.com/portal',
    );
    expect(getOAuthRedirectUrl('/portal/admin#billing', 'http://localhost:5000')).toBe(
      'http://localhost:5000/portal/admin',
    );
  });
});

describe('Supabase env resolution', () => {
  it('falls back to the legacy names when CLOUD values are empty', () => {
    const resolved = resolveSupabaseEnv(
      { VITE_SUPABASE_URL_CLOUD: '', VITE_SUPABASE_URL: URL_CLOUD, VITE_SUPABASE_ANON_KEY: ' key ' },
      true,
    );
    expect(resolved).toMatchObject({ url: URL_CLOUD, anonKey: 'key', anonKeyVarName: 'VITE_SUPABASE_ANON_KEY' });
  });

  it('accepts a matching anon JWT and a publishable key', () => {
    expect(getSupabaseKeyProblem(URL_CLOUD, makeJwt({ ref: 'abcdefghijklmnop', role: 'anon' }))).toBeNull();
    expect(getSupabaseKeyProblem(URL_CLOUD, 'sb_publishable_abc123')).toBeNull();
  });

  it('rejects a key with text appended to it', () => {
    const corrupted = `${makeJwt({ ref: 'abcdefghijklmnop', role: 'anon' })}CONTAINER_HOST=podman`;
    expect(getSupabaseKeyProblem(URL_CLOUD, corrupted)).toMatch(/not a valid JWT/);
  });

  it('rejects keys for another project or with elevated roles', () => {
    expect(getSupabaseKeyProblem(URL_CLOUD, makeJwt({ ref: 'otherproject', role: 'anon' }))).toMatch(/otherproject/);
    expect(getSupabaseKeyProblem(URL_CLOUD, makeJwt({ ref: 'abcdefghijklmnop', role: 'service_role' }))).toMatch(
      /service_role/,
    );
    expect(getSupabaseKeyProblem(URL_CLOUD, 'sb_secret_abc')).toMatch(/secret/);
  });
});
