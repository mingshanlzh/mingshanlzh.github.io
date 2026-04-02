"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DEFAULT_PAGES: Record<string, boolean> = {
  publications: true, cv: true, projects: true, teaching: true,
  supervision: true, talks: true, news: true, research: true,
  media: true, awards: true, services: true, affiliations: true,
  blog: true, contact: true,
};

type AdminContextType = {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  pageVisibility: Record<string, boolean>;
  togglePage: (id: string) => void;
};

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
  pageVisibility: DEFAULT_PAGES,
  togglePage: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageVisibility, setPageVisibility] = useState<Record<string, boolean>>(DEFAULT_PAGES);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sj_admin");
      if (stored === "true") setIsAdmin(true);
      const pages = localStorage.getItem("sj_pages");
      if (pages) setPageVisibility({ ...DEFAULT_PAGES, ...JSON.parse(pages) });
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

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, pageVisibility, togglePage }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
