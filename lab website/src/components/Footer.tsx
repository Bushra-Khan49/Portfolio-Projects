'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Twitter, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    const [social, setSocial] = useState({ email: 'vance.nexus@nexusgenomics.edu', whatsapp: '', linkedin: '', twitter: '' });

    useEffect(() => {
        fetch('/api/admin-data?type=about')
            .then(r => r.json())
            .then(data => {
                if (data && data.social) setSocial(data.social);
            })
            .catch(() => {});
    }, []);

    return (
        <footer id="footer" className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                {/* Brand & Address - Left */}
                <div className={styles.brandSection}>
                    <div className={styles.logoGroup}>
                        <div className={styles.logoText}>
                            <span>Nexus</span>
                            <span>Genomics</span>
                            <span>Institute</span>
                        </div>
                    </div>
                    <p className={styles.address}>
                        Nexus Genomics Institute<br />
                        Advanced Systems Bio-Innovation Hub<br />
                        Horizon City, HC 94016
                    </p>
                </div>

                {/* Contact & Social - Center */}
                <div className={styles.contactSection}>
                    <h4 className={styles.columnTitle}>Get in Touch</h4>
                    <p className={styles.contactLine}>
                        <strong>Email:</strong><br />
                        <a href={`mailto:${social.email}`} style={{ color: 'inherit' }}>{social.email}</a>
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        {social.whatsapp && (
                            <a href={`https://wa.me/${social.whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Chat on WhatsApp">
                                <MessageCircle size={20} />
                            </a>
                        )}
                        {social.linkedin && (
                            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <Linkedin size={20} />
                            </a>
                        )}
                        {social.twitter && (
                            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                                <Twitter size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Explore Links - Right */}
                <div className={styles.linksSection}>
                    <h4 className={styles.columnTitle}>Explore</h4>
                    <div className={styles.linkGrid}>
                        <Link href="/research" className={styles.link}>Research</Link>
                        <Link href="/about" className={styles.link}>About Us</Link>
                        <Link href="/facilities" className={styles.link}>Facilities</Link>
                        <Link href="/goals" className={styles.link}>Lab Goals</Link>
                        <Link href="/admin" className={styles.link}>Admin Portal</Link>
                        <Link href="/join" className={styles.link}>Join the Lab</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomContainer}`}>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.legalLink}>Terms of Use</Link>
                    </div>
                    <p className={styles.copyrightText}>© {new Date().getFullYear()} Nexus Genomics Institute | Systems Bio-Innovation Hub</p>
                </div>
            </div>
        </footer>
    );
}
