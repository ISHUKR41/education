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

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Sun, Moon, Home, BookOpen, GraduationCap,
  Code2, Users, Trophy, Zap, Swords, BarChart3
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import styles from "./Navbar.module.css";

/**
 * Maps icon name strings from constants to actual Lucide icon components.
 * This keeps the constants file free of React imports.
 */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Home, BookOpen, GraduationCap, Code2, Users, Trophy, Swords, BarChart3,
};

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
  /* Track whether the mobile drawer menu is currently open */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Track the current theme (light or dark) */
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = localStorage.getItem("eduquest-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored === "dark" || (!stored && prefersDark);
  });

  /* Get the current URL path to highlight the active nav link */
  const pathname = usePathname();

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
    document.body.style.overflow = "";
  };

  /**
   * Open the mobile drawer and disable body scrolling
   * to prevent the page from scrolling behind the drawer.
   */
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = "hidden";
  };

  /**
   * Check if a given href matches the current path.
   * Used to apply the active style to the current page's nav link.
   */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
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
          {NAV_LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon];
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
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

          {/* Desktop Auth Buttons */}
          <Link href="/sign-in" className={styles.signInBtn}>Sign In</Link>
          <Link href="/sign-up" className={styles.signUpBtn}>Sign Up</Link>

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
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={styles.mobileNavLink}
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
              <Link href="/sign-in" className={styles.mobileSignIn} onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link href="/sign-up" className={styles.mobileSignUp} onClick={closeMobileMenu}>
                Sign Up Free
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
