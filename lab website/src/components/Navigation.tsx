'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search as SearchIcon, Lock, Moon, Sun } from 'lucide-react';
import styles from './Navigation.module.css';
import SearchModal from '@/components/ui/SearchModal';
import LoginModal from '@/components/ui/LoginModal';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Research', href: '/#research' },
    { name: 'Facilities', href: '/#facilities' },
    { name: 'Meetings', href: '/#meetings' },
    { name: 'Goals', href: '/#goals' },
    { name: 'About', href: '/#about' },
    { name: 'Team', href: '/#team' },
    { name: 'Join the Lab', href: '/#join' },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Init theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY = currentScrollY;
            setScrolled(currentScrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

            <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
                <div className={`container ${styles.navContainer}`}>

                    {/* Logo */}
                    <div className={styles.logoGroup}>

                        <Link href="/" className={styles.logoText}>
                            <span>Nexus</span>
                            <span>Genomics</span>
                            <span>Institute</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className={styles.desktopLinks}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={link.name === 'Join the Lab' ? styles.joinBtn : styles.link}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button className={styles.iconBtn} aria-label="Toggle Theme" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <button className={styles.iconBtn} aria-label="Search Database" onClick={() => setSearchOpen(true)}>
                            <SearchIcon size={18} />
                        </button>

                        <button className={styles.iconBtn} aria-label="Admin Login" onClick={() => setLoginOpen(true)}>
                            <Lock size={18} />
                        </button>

                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={styles.mobileLink}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
}
