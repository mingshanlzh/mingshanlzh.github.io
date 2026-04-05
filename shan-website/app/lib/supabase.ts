import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ─── Shared types ─────────────────────────────────────────────────────────────

export type GuestAccount = {
  id: string;
  username: string;
  password: string;
  display_name: string;
  collaborator_label: string;
  active: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  guest_username?: string;
  read: boolean;
  created_at: string;
};

export type Award = {
  id: string;
  entry_type: "award" | "grant";
  title: string;
  organisation?: string;
  year?: number;
  funder?: string;
  amount?: string;
  period?: string;
  role?: string;
  link?: string;
  sort_order: number;
};

export type DocAttachment = {
  id: string;
  name: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  summary?: string;
  status: "active" | "completed" | "paused";
  tags: string[];
  collaborator_labels: string[];
  notice?: string;
  notice_type?: "info" | "warning" | "success";
  documents: DocAttachment[];
  last_updated?: string;
  created_at?: string;
};

export type Publication = {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  tags: string[];
  featured: boolean;
  pub_type: string;
  status: string;
  sort_order: number;
  highlight_text?: string;
  highlight_labels?: string[];
  highlight_pdf?: string;
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
