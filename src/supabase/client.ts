import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { getSupabaseKeyProblem, getSupabaseProjectRef, resolveSupabaseEnv } from './config';

function getRequiredEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Prefer explicit local/cloud keys; fallback to legacy names to avoid breaking existing setups.
const resolvedEnv = resolveSupabaseEnv(import.meta.env, import.meta.env.PROD);

export const supabaseUrl = getRequiredEnvVar(resolvedEnv.urlVarName, resolvedEnv.url);
export const supabaseAnonKey = getRequiredEnvVar(resolvedEnv.anonKeyVarName, resolvedEnv.anonKey);

// The build already fails on a bad key (vite.config.ts); this catches dev servers
// without taking the whole site down.
const supabaseKeyProblem = getSupabaseKeyProblem(supabaseUrl, supabaseAnonKey);
if (supabaseKeyProblem) {
  console.error(
    `[supabase] ${resolvedEnv.anonKeyVarName} is invalid: ${supabaseKeyProblem}. Auth requests will fail with "Invalid API key".`,
  );
}

export const supabaseProjectRef = getSupabaseProjectRef(supabaseUrl);
export const supabaseAuthStorageKey = `sb-${supabaseProjectRef}-auth-token`;

const LEGACY_AUTH_STORAGE_KEYS = ['supabase.auth.token'];

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: supabaseAuthStorageKey,
  },
});

function removeStoredKeys(storage: Storage): void {
  const keysToRemove: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) continue;

    const isCurrentProjectKey =
      key === supabaseAuthStorageKey ||
      key === `${supabaseAuthStorageKey}-code-verifier` ||
      key.startsWith(`sb-${supabaseProjectRef}-`);

    if (isCurrentProjectKey || LEGACY_AUTH_STORAGE_KEYS.includes(key)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    storage.removeItem(key);
  }
}

export function clearStoredSupabaseSession(): void {
  if (typeof window === 'undefined') return;

  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      removeStoredKeys(storage);
    } catch {
      // Ignore storage access issues so sign-out still completes.
    }
  }
}

export function getSupabaseFunctionUrl(functionName: string): string {
  return `${supabaseUrl}/functions/v1/${functionName}`;
}
