import { createClient } from "@supabase/supabase-js";

// These env vars must be set in .env.local (never commit the service role key)
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnon);

// Type helpers for common Supabase operations
export type Project = {
  id: string;
  title: string;
  description: string;
  milestone: number;
  tags: string[];
  last_updated: string;
};

export type Upload = {
  id: string;
  project_id: string;
  filename: string;
  storage_path: string;
  note: string;
  created_at: string;
};

export type NewsItem = {
  id: string;
  type: string;
  title: string;
  summary: string;
  link: string;
  item_date: string;
  tags: string[];
};
