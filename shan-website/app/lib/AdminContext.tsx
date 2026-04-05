"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/app/lib/supabase";

export type GuestSession = {
  id: string;
  username: string;
  display_name: string;
  collaborator_label: string;
};

const DEFAULT_PAGES: Record<string, boolean> = {
  publications: true, cv: true, projects: true, teaching: true,
  supervision: true, talks: true, news: true, research: true,
  media: true, awards: true, services: true, affiliations: true,
  blog: true, contact: true,
};

type AdminContextType = {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  pageVisibility: Record<string, boolean>;
  togglePage: (id: string) => Promise<void>;
  isGuest: boolean;
  guestUser: GuestSession | null;
  guestLogin: (username: string, password: string) => Promise<boolean>;
  guestLogout: () => void;
};

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => false,
  logout: async () => {},
  pageVisibility: DEFAULT_PAGES,
  togglePage: async () => {},
  isGuest: false,
  guestUser: null,
  guestLogin: async () => false,
  guestLogout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(DEFAULT_PAGES);
  const [isGuest, setIsGuest] = useState(false);
  const [guestUser, setGuestUser] = useState<GuestSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAdmin(true);

      const { data: pages } = await supabase
        .from("page_config")
        .select("page_id, visible");
      if (pages && pages.length > 0) {
        const vis: Record<string, boolean> = { ...DEFAULT_PAGES };
        pages.forEach((row: { page_id: string; visible: boolean }) => {
          vis[row.page_id] = row.visible;
        });
        setPageVisibility(vis);
      }

      try {
        const stored = localStorage.getItem("sj_guest_session");
        if (stored) {
          const g = JSON.parse(stored) as GuestSession;
          setIsGuest(true);
          setGuestUser(g);
        }
      } catch {}

      setLoaded(true);
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    setIsAdmin(true);
    return true;
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }

  async function togglePage(id: string): Promise<void> {
    const newVal = !pageVisibility[id];
    setPageVisibility(prev => ({ ...prev, [id]: newVal }));
    await supabase
      .from("page_config")
      .upsert({ page_id: id, visible: newVal, updated_at: new Date().toISOString() });
  }

  async function guestLogin(username: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("guest_login", {
      p_username: username,
      p_password: password,
    });
    if (error || !data) return false;
    const session = data as GuestSession;
    setIsGuest(true);
    setGuestUser(session);
    localStorage.setItem("sj_guest_session", JSON.stringify(session));
    return true;
  }

  function guestLogout(): void {
    setIsGuest(false);
    setGuestUser(null);
    localStorage.removeItem("sj_guest_session");
  }

  if (!loaded) return null;

  return (
    <AdminContext.Provider
      value={{
        isAdmin, login, logout, pageVisibility, togglePage,
        isGuest, guestUser, guestLogin, guestLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
