"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./navbar.module.css";

interface NavbarProps {
  icon: React.ReactNode;
  appName: string;
  links?: { label: string; href: string; external?: boolean }[];
  action: React.ReactNode;
  /*
    A second action for the burger menu only. The compact bar has room for one
    button, but the open menu can carry an alternative route into the app.
  */
  mobileAction?: React.ReactNode;
}

const MOBILE_MENU_ID = "navbar-mobile-menu";

/*
  Drawn here rather than set in the icon font: this is the only way into the
  navigation on a phone, so it should not wait for a font from another host,
  or turn into the word "menu" where that font is blocked.
*/
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {open ? (
        <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
      ) : (
        <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  );
}

export function Navbar({
  icon,
  appName,
  links,
  action,
  mobileAction,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(width < 768px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        setMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /*
    The open menu covers part of the page without blocking the rest of it, so
    it gets the two ways out people try first: Escape, and a tap anywhere else.
  */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;

      if (
        container &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileMenuOpen]);

  const isSolid = isScrolled || mobileMenuOpen;

  return (
    <>
      <div className={styles.spacer}></div>
      <div className={styles.navbarContainer} ref={containerRef}>
        <nav className={styles.navbar}>
          <div className={`${styles.content} ${isSolid ? styles.solid : ""}`}>
            <Link className={styles.appIdentity} href="/">
              <div className={styles.appIconContainer}>{icon}</div>

              <div className={styles.appName}>{appName}</div>
            </Link>

            <ul className={styles.navLinks}>
              {links?.map((link) => {
                const href = link.href.startsWith("#")
                  ? `/${link.href}`
                  : link.href;

                return (
                  <li key={link.href} className={styles.navLinkItem}>
                    {link.external ? (
                      <a href={href}>{link.label}</a>
                    ) : (
                      <Link href={href}>{link.label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className={styles.action}>{action}</div>

            <button
              ref={menuButtonRef}
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuOpen ? MOBILE_MENU_ID : undefined}
            >
              <MenuGlyph open={mobileMenuOpen} />
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu} id={MOBILE_MENU_ID}>
            <ul className={styles.mobileMenuLinks}>
              {links?.map((link) => {
                const href = link.href.startsWith("#")
                  ? `/${link.href}`
                  : link.href;

                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={href} onClick={closeMenu}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={href} onClick={closeMenu}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className={styles.mobileMenuActions} onClick={closeMenu}>
              {action}
              {mobileAction}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
