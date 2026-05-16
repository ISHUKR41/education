/**
 * FILE: Navbar.tsx
 * LOCATION: src/components/layout/Navbar/Navbar.tsx
 * PURPOSE: Main top navigation bar for the EduQuest platform.
 *          Shows logo, nav links (desktop), auth buttons, theme toggle,
 *          and a mobile hamburger drawer menu. Sticky at the top of every page.
 * USED BY: src/app/layout.tsx — appears on every page of the application
 * DEPENDENCIES: next/link, lucide-react, Navbar.module.css, constants.ts
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useState, useEffect, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Sun, Moon, Home, BookOpen, GraduationCap,
  ClipboardCheck, Code2, LayoutDashboard, LogOut, Users, Trophy, Zap, Swords, BarChart3,
  ChevronDown, type LucideIcon
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./Navbar.module.css";

/**
 * Maps icon name strings from constants to actual Lucide icon components.
 * This keeps the constants file free of React imports.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Home, BookOpen, GraduationCap, ClipboardCheck, Code2, Users, Trophy, Swords, BarChart3,
};

type NavHref = (typeof NAV_LINKS)[number]["href"];

/** Find a link from the shared nav constants so labels and URLs stay in one place. */
function getNavLink(href: NavHref) {
  const link = NAV_LINKS.find((item) => item.href === href);

  if (!link) {
    throw new Error(`Missing navigation link for ${href}`);
  }

  return link;
}

const LINK_DESCRIPTIONS: Record<NavHref, string> = {
  "/": "Return to the main landing page",
  "/class-9": "Foundation subjects and chapter plans",
  "/class-10": "Board-focused revision and practice",
  "/class-11": "Stream-based academic tracks",
  "/class-12": "Board and entrance preparation",
  "/engineering": "Coding tracks and technical subjects",
  "/test": "Practice tests and assessments",
  "/battle": "Real-time quiz competitions",
  "/leaderboard": "Progress, XP, and rankings",
  "/community": "Peer discussions and support",
  "/events": "College events and learning challenges",
};

const NAV_GROUPS = [
  {
    id: "learn",
    label: "Learn",
    description: "Classes and engineering",
    icon: BookOpen,
    links: [
      getNavLink("/class-9"),
      getNavLink("/class-10"),
      getNavLink("/class-11"),
      getNavLink("/class-12"),
      getNavLink("/engineering"),
    ],
  },
  {
    id: "practice",
    label: "Practice",
    description: "Tests and competitions",
    icon: ClipboardCheck,
    links: [
      getNavLink("/test"),
      getNavLink("/battle"),
      getNavLink("/leaderboard"),
    ],
  },
  {
    id: "community",
    label: "Community",
    description: "Peers and events",
    icon: Users,
    links: [
      getNavLink("/community"),
      getNavLink("/events"),
    ],
  },
] as const;

type NavGroupId = (typeof NAV_GROUPS)[number]["id"];

/**
 * Navbar Component
 * 
 * The main navigation bar that appears at the top of every page.
 * Features:
 * - Sticky positioning with glass morphism background
 * - Desktop: horizontal nav links with active state highlighting
 * - Mobile: hamburger button that opens a slide-out drawer
 * - Theme toggle button (light/dark mode)
 * - Sign In and Sign Up buttons
 */
export default function Navbar() {
  const pathname = usePathname();

  /*
   * Keying the stateful shell by pathname resets open menus after navigation
   * without calling setState inside an effect. This keeps React 19 lint happy
   * and prevents stale mobile drawers when users navigate with browser controls.
   */
  return <NavbarShell key={pathname} pathname={pathname} />;
}

interface NavbarShellProps {
  pathname: string;
}

/** Stateful navbar implementation for one active route. */
function NavbarShell({ pathname }: NavbarShellProps) {
  /* Track whether the mobile drawer menu is currently open */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<NavGroupId | null>(null);

  /*
   * Track the current theme (light or dark).
   * The initial value stays server-safe so the first client render matches SSR.
   * The real preference is loaded in an effect immediately after hydration.
   */
  const [isDark, setIsDark] = useState(false);

  /* Router is used only for post-sign-out navigation. */
  const router = useRouter();

  /** Session-aware top shell state hydrated from the existing auth endpoint. */
  const [sessionState, setSessionState] = useState<"checking" | "guest" | "authenticated">("checking");

  /**
   * Keep page scroll locked only while the mobile drawer is open.
   * Cleanup prevents stale body styles if the Navbar unmounts mid-navigation.
   */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /**
   * Keep the root class synchronized with the current theme state.
   * This effect updates the external DOM system without deriving React state.
   */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  }, [isDark]);

  /**
   * Hydrates the saved/system theme after the initial paint.
   * This avoids server/client markup differences in the theme button icon.
   */
  useEffect(() => {
    const stored = localStorage.getItem("eduquest-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = stored === "dark" || (!stored && prefersDark);
    const timer = window.setTimeout(() => setIsDark(resolvedTheme), 0);

    return () => window.clearTimeout(timer);
  }, []);

  /**
   * Resolve whether the current visitor already has a valid cookie session.
   * The navbar uses this lightweight API result to show connected account actions.
   */
  useEffect(() => {
    let isMounted = true;

    async function loadSessionState() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!isMounted) {
          return;
        }

        setSessionState(response.ok ? "authenticated" : "guest");
      } catch {
        if (isMounted) {
          setSessionState("guest");
        }
      }
    }

    loadSessionState();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Toggle between light and dark mode.
   * Saves preference to localStorage so it persists across visits.
   */
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      localStorage.setItem("eduquest-theme", "dark");
    } else {
      localStorage.setItem("eduquest-theme", "light");
    }
  };

  /**
   * Close the mobile drawer and re-enable body scrolling.
   * Called when user clicks a link or the close button.
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Open the mobile drawer. Body scroll locking is handled by an effect.
   */
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setActiveDesktopGroup(null);
  };

  /** Clears the signed session cookie and returns the visitor to the public home page. */
  const handleSignOut = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setSessionState("guest");
    closeMobileMenu();
    router.push("/");
    router.refresh();
  };

  /**
   * Check if a given href matches the current path.
   * Used to apply the active style to the current page's nav link.
   */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeDesktopMenuOnBlur = (event: FocusEvent<HTMLLIElement>) => {
    const nextTarget = event.relatedTarget as Node | null;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setActiveDesktopGroup(null);
    }
  };

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navbarInner}>
        {/* --- Logo Section --- */}
        <Link href="/" className={styles.logo} aria-label="EduQuest Home">
          <span className={styles.logoIcon}>
            <Zap size={16} />
          </span>
          <span className={styles.logoText}>EduQuest</span>
        </Link>

        {/* --- Desktop Navigation Links --- */}
        <ul className={styles.navLinks}>
          <li>
            <Link
              href="/"
              className={`${styles.navLink} ${isActive("/") ? styles.navLinkActive : ""}`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <Home size={16} />
              Home
            </Link>
          </li>

          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const groupIsOpen = activeDesktopGroup === group.id;
            const groupIsActive = group.links.some((link) => isActive(link.href));

            return (
              <li key={group.id} className={styles.navGroupItem} onBlur={closeDesktopMenuOnBlur}>
              <button
                type="button"
                  className={`${styles.navLink} ${styles.navGroupButton} ${groupIsActive ? styles.navLinkActive : ""}`}
                  onClick={() => setActiveDesktopGroup(groupIsOpen ? null : group.id)}
                aria-haspopup="menu"
                  aria-expanded={groupIsOpen}
                  aria-controls={`nav-menu-${group.id}`}
              >
                  <GroupIcon size={16} />
                  {group.label}
                  <ChevronDown size={14} className={groupIsOpen ? styles.navChevronOpen : ""} />
              </button>

                {groupIsOpen && (
                  <div
                    id={`nav-menu-${group.id}`}
                    className={styles.navDropdown}
                    role="menu"
                    aria-label={`${group.label} navigation links`}
                  >
                    <div className={styles.navDropdownHeader}>
                      <span>{group.label}</span>
                      <small>{group.description}</small>
                    </div>
                    {group.links.map((link) => {
                    const Icon = ICON_MAP[link.icon];
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                          className={`${styles.navDropdownLink} ${active ? styles.navDropdownLinkActive : ""}`}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                          onClick={() => setActiveDesktopGroup(null)}
                      >
                          <span className={styles.navDropdownIcon}>
                            {Icon && <Icon size={17} />}
                          </span>
                          <span className={styles.navDropdownText}>
                            <span className={styles.navDropdownLabel}>{link.label}</span>
                            <span className={styles.navDropdownDesc}>{LINK_DESCRIPTIONS[link.href]}</span>
                          </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
            );
          })}
        </ul>

        {/* --- Right Side Actions --- */}
        <div className={styles.navActions}>
          {/* Theme Toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Desktop Account / Auth Buttons */}
          <div className={styles.accountActions} aria-busy={sessionState === "checking"}>
            {sessionState === "checking" ? (
              <span className={styles.accountSkeleton} aria-hidden="true" />
            ) : sessionState === "authenticated" ? (
              <>
                <Link href="/dashboard" className={styles.dashboardBtn}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button className={styles.signOutBtn} onClick={handleSignOut}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className={styles.signInBtn}>Sign In</Link>
                <Link href="/sign-up" className={styles.signUpBtn}>Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={openMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* --- Mobile Drawer Menu --- */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay — clicking it closes the drawer */}
          <div
            className={styles.mobileOverlay}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className={styles.mobileDrawer} role="dialog" aria-label="Mobile menu">
            <div className={styles.mobileDrawerHeader}>
              <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
                <span className={styles.logoIcon}><Zap size={14} /></span>
                <span className={styles.logoText}>EduQuest</span>
              </Link>
              <button
                className={styles.mobileDrawerClose}
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <ul className={styles.mobileNavLinks}>
              {NAV_LINKS.map((link) => {
                const Icon = ICON_MAP[link.icon];
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMobileMenu}
                    >
                      {Icon && <Icon size={20} />}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={styles.mobileAuthButtons}>
              {sessionState === "checking" ? (
                <span className={styles.mobileAccountSkeleton} aria-hidden="true" />
              ) : sessionState === "authenticated" ? (
                <>
                  <Link href="/dashboard" className={styles.mobileDashboard} onClick={closeMobileMenu}>
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button className={styles.mobileSignOut} onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className={styles.mobileSignIn} onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                  <Link href="/sign-up" className={styles.mobileSignUp} onClick={closeMobileMenu}>
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
