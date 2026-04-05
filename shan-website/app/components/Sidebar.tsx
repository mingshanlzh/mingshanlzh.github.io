"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home, BookOpen, FileText, Folder, GraduationCap, Users,
  Mic2, Newspaper, Star, Tv2, Trophy, Wrench, Building2,
  PenLine, Mail, ChevronRight, Menu, X, Settings, UserCircle
} from "lucide-react";
import { useAdmin } from "@/app/lib/AdminContext";

const navItems = [
  { label: "Home",             href: "/",              icon: Home },
  { label: "News",             href: "/news",           icon: Newspaper },
  { label: "Publications",     href: "/publications",   icon: BookOpen },
  { label: "Featured Research",href: "/research",       icon: Star },
  { label: "Working Projects", href: "/projects",       icon: Folder },
  { label: "Talks",            href: "/talks",          icon: Mic2 },
  { label: "Team",             href: "/supervision",    icon: Users },
  { label: "Teaching",         href: "/teaching",       icon: GraduationCap },
  { label: "Media",            href: "/media",          icon: Tv2 },
  { label: "Awards & Grants",  href: "/awards",         icon: Trophy },
  { label: "Services",         href: "/services",       icon: Wrench },
  { label: "Affiliations",     href: "/affiliations",   icon: Building2 },
  { label: "Blog",             href: "/blog",           icon: PenLine },
  { label: "CV",               href: "/cv",             icon: FileText },
  { label: "Contact",          href: "/contact",        icon: Mail },
];

function NavList({
  pathname,
  onLinkClick,
  visiblePages,
}: {
  pathname: string;
  onLinkClick?: () => void;
  visiblePages: Record<string, boolean>;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("sidebar-scroll");
    if (stored && navRef.current) {
      navRef.current.scrollTop = Number(stored);
    }
  }, []);

  function handleScroll() {
    if (navRef.current) {
      sessionStorage.setItem("sidebar-scroll", String(navRef.current.scrollTop));
    }
  }

  return (
    <div
      ref={navRef}
      onScroll={handleScroll}
      className="flex-1 px-3 pt-4 overflow-y-auto"
      style={{ overscrollBehavior: "contain" }}
    >
      {navItems.filter(({ href }) => {
        if (href === "/") return true;
        const pageId = href.replace("/", "");
        return visiblePages[pageId] !== false;
      }).map(({ label, href, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            scroll={false}
            onClick={onLinkClick}
            className={`nav-item flex items-center gap-3 px-3 py-2 mb-0.5 rounded-lg text-sm transition-all duration-150 ${
              active ? "active" : ""
            }`}
            style={{ color: active ? "white" : "var(--text-on-dark-muted)" }}
          >
            <Icon size={16} />
            <span>{label}</span>
            {active && (
              <ChevronRight size={12} className="ml-auto opacity-60" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { pageVisibility, isGuest, guestUser, guestLogout } = useAdmin();

  const profile = (
    <div
      className="px-5 pb-6 border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--accent)", color: "white" }}
        >
          SJ
        </div>
        <div>
          <div
            className="font-semibold text-sm"
            style={{ color: "var(--text-on-dark)" }}
          >
            Shan Jiang
          </div>
          <div className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
            PhD · MUCHE
          </div>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div
      className="px-5 pt-4 border-t"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {isGuest && guestUser ? (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-on-dark)" }}>
            <UserCircle size={13} />
            <span>{guestUser.display_name}</span>
          </div>
          <button
            onClick={guestLogout}
            className="text-xs transition-colors"
            style={{ color: "var(--text-on-dark-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Sign out (guest)
          </button>
        </div>
      ) : (
        <Link
          href="/guest"
          scroll={false}
          className="flex items-center gap-2 text-xs transition-colors mb-2"
          style={{ color: "var(--text-on-dark-muted)" }}
        >
          <UserCircle size={13} />
          Guest Login
        </Link>
      )}
      <Link
        href="/admin"
        scroll={false}
        className="flex items-center gap-2 text-xs transition-colors"
        style={{ color: "var(--text-on-dark-muted)" }}
      >
        <Settings size={13} />
        Admin Login
      </Link>
    </div>
  );

  return (
    <>
      <aside
        className="fixed top-0 left-0 h-full z-40 hidden md:flex flex-col"
        style={{
          width: "var(--sidebar-w)",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex flex-col h-full py-6">
          {profile}
          <NavList pathname={pathname} visiblePages={pageVisibility} />
          {footer}
        </div>
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: "var(--bg-sidebar)", color: "var(--text-on-dark)" }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "var(--sidebar-w)", background: "var(--bg-sidebar)" }}
      >
        <div className="flex flex-col h-full py-6">
          {profile}
          <NavList pathname={pathname} onLinkClick={() => setOpen(false)} visiblePages={pageVisibility} />
          {footer}
        </div>
      </aside>
    </>
  );
}
