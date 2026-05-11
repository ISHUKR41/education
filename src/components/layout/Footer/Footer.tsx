/**
 * FILE: Footer.tsx
 * LOCATION: src/components/layout/Footer/Footer.tsx
 * PURPOSE: Site-wide footer component displayed at the bottom of every page.
 *          Contains branded section, link columns, copyright, and social links.
 * USED BY: src/app/layout.tsx — appears on every page
 * DEPENDENCIES: next/link, lucide-react, Footer.module.css, constants.ts
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { Zap, Code2, Globe, ExternalLink } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import styles from "./Footer.module.css";

/**
 * Footer Component
 * 
 * Displays a professional footer with four link columns, branding,
 * social media links, and copyright notice. Fully responsive.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          {/* Brand Section — Left Column */}
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}><Zap size={14} /></span>
              {SITE_CONFIG.name}
            </Link>
            <p className={styles.footerTagline}>
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Platform Links Column */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Platform</h3>
            <ul className={styles.footerColumnLinks}>
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Links Column */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Learn</h3>
            <ul className={styles.footerColumnLinks}>
              {FOOTER_LINKS.learn.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links Column */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Community</h3>
            <ul className={styles.footerColumnLinks}>
              {FOOTER_LINKS.community.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links Column */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Legal</h3>
            <ul className={styles.footerColumnLinks}>
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar — Copyright + Social Links */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className={styles.footerSocials}>
            <Link href="/engineering" className={styles.footerSocial} aria-label="Engineering"><Code2 size={16} /></Link>
            <Link href="/community" className={styles.footerSocial} aria-label="Community"><Globe size={16} /></Link>
            <Link href="/contact" className={styles.footerSocial} aria-label="Contact"><ExternalLink size={16} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
