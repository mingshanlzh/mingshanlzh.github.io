"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DEFAULT_PAGES: Record<string, boolean> = {
  publications: true, cv: true, projects: true, teaching: true,
  supervision: true, talks: true, news: true, research: true,
  media: true, awards: true, services: true, affiliations: true,
  blog: true, contact: true,
};

export type GuestAccount = {
  id: string;
  name: string;
  username: string;
  password: string;
  collaboratorLabel: string;
};

type AdminContextType = {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  pageVisibility: Record<string, boolean>;
  togglePage: (id: string) => void;
  // Guest auth
  isGuest: boolean;
  guestUser: GuestAccount | null;
  guestLogin: (username: string, password: string) => boolean;
  guestLogout: () => void;
  // Guest accounts CRUD (admin only)
  guestAccounts: GuestAccount[];
  addGuestAccount: (account: Omit<GuestAccount, "id">) => void;
  updateGuestAccount: (id: string, account: Partial<GuestAccount>) => void;
  deleteGuestAccount: (id: string) => void;
};

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
  pageVisibility: DEFAULT_PAGES,
  togglePage: () => {},
  isGuest: false,
  guestUser: null,
  guestLogin: () => false,
  guestLogout: () => {},
  guestAccounts: [],
  addGuestAccount: () => {},
  updateGuestAccount: () => {},
  deleteGuestAccount: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(DEFAULT_PAGES);
  const [isGuest, setIsGuest] = useState(false);
  const [guestUser, setGuestUser] = useState<GuestAccount | null>(null);
  const [guestAccounts, setGuestAccounts] = useState<GuestAccount[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_admin");
      if (stored === "true") setIsAdmin(true);
      const pages = localStorage.getItem("sj_pages");
      if (pages) setPageVisibility({ ...DEFAULT_PAGES, ...JSON.parse(pages) });
      const storedGuest = localStorage.getItem("sj_guest_session");
      if (storedGuest) {
        const g = JSON.parse(storedGuest) as GuestAccount;
        setIsGuest(true);
        setGuestUser(g);
      }
      const accounts = localStorage.getItem("sj_guest_accounts");
      if (accounts) setGuestAccounts(JSON.parse(accounts));
    } catch {}
  }, []);

  function login(email: string, password: string): boolean {
    if (email === "shan.jiang@mq.edu.au" && password.length >= 6) {
      setIsAdmin(true);
      localStorage.setItem("sj_admin", "true");
      return true;
    }
    return false;
  }

  function logout() {
    setIsAdmin(false);
    localStorage.removeItem("sj_admin");
  }

  function togglePage(id: string) {
    setPageVisibility((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("sj_pages", JSON.stringify(next));
      return next;
    });
  }

  function guestLogin(username: string, password: string): boolean {
    const accts: GuestAccount[] = JSON.parse(localStorage.getItem("sj_guest_accounts") || "[]");
    const match = accts.find(
      (a) => a.username === username && a.password === password
    );
    if (match) {
      setIsGuest(true);
      setGuestUser(match);
      localStorage.setItem("sj_guest_session", JSON.stringify(match));
      return true;
    }
    return false;
  }

  function guestLogout() {
    setIsGuest(false);
    setGuestUser(null);
    localStorage.removeItem("sj_guest_session");
  }

  function addGuestAccount(account: Omit<GuestAccount, "id">) {
    const newAccount: GuestAccount = {
      ...account,
      id: `guest_${Date.now()}`,
    };
    const next = [...guestAccounts, newAccount];
    setGuestAccounts(next);
    localStorage.setItem("sj_guest_accounts", JSON.stringify(next));
  }

  function updateGuestAccount(id: string, updates: Partial<GuestAccount>) {
    const next = guestAccounts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setGuestAccounts(next);
    localStorage.setItem("sj_guest_accounts", JSON.stringify(next));
    // Update session if current guest is being updated
    if (guestUser?.id === id) {
      const updated = { ...guestUser, ...updates };
      setGuestUser(updated);
      localStorage.setItem("sj_guest_session", JSON.stringify(updated));
    }
  }

  function deleteGuestAccount(id: string) {
    const next = guestAccounts.filter((a) => a.id !== id);
    setGuestAccounts(next);
    localStorage.setItem("sj_guest_accounts", JSON.stringify(next));
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin, login, logout, pageVisibility, togglePage,
        isGuest, guestUser, guestLogin, guestLogout,
        guestAccounts, addGuestAccount, updateGuestAccount, deleteGuestAccount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
