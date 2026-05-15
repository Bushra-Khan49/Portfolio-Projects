import Link from 'next/link';

import styles from './Footer.module.css';

export default function Footer() {
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

                {/* Contact - Center */}
                <div className={styles.contactSection}>
                    <h4 className={styles.columnTitle}>Contact</h4>
                    <p className={styles.contactLine}>
                        <strong>Email:</strong><br />
                        evelyn.vance@nexus-genomics.org
                    </p>
                    <p className={styles.contactLine}>
                        <strong>Location:</strong><br />
                        Building 4, Wing B
                    </p>
                </div>

                {/* Explore Links - Right */}
                <div className={styles.linksSection}>
                    <h4 className={styles.columnTitle}>Explore</h4>
                    <div className={styles.linkGrid}>
                        <Link href="/#research" className={styles.link}>Research</Link>
                        <Link href="/#facilities" className={styles.link}>Facilities</Link>
                        <Link href="/#progress" className={styles.link}>Lab Progress</Link>
                        <Link href="/#team" className={styles.link}>Team</Link>
                        <Link href="/#publications" className={styles.link}>Publications</Link>
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
                    <p className={styles.copyrightText}>© Systems Bio-Innovation Hub | Maintained by Nexus Systems Research Group</p>
                </div>
            </div>
        </footer>
    );
}
