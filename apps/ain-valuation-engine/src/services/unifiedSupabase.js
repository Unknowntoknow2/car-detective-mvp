import { createClient } from "@supabase/supabase-js";
function env(name, fallback) {
  const v = (typeof window !== "undefined" && import.meta?.env?.[name]) || process.env[name] || fallback;
  return v;
}
const URL = env("VITE_SUPABASE_URL", "http://127.0.0.1:54321");
const ANON = env("VITE_SUPABASE_ANON_KEY", "anon-test-key");
const SERVICE = env("SUPABASE_SERVICE_ROLE_KEY", "service-role-test-key");

export class SupabaseManager {
  static #client;
  static #service;
  static getClient() { return this.#client ||= createClient(URL, ANON); }
  static getServiceClient() { return this.#service ||= createClient(URL, SERVICE); }
}
export const supabase = SupabaseManager.getClient();
export const supabaseService = SupabaseManager.getServiceClient();
