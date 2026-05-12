import Link from 'next/link';
import styles from './JoinLab.module.css';

export default function JoinLab() {
    return (
        <section id="join" className={`section ${styles.joinSection}`}>
            {/* The background image here is intended to be dynamically injected via Sanity CMS */}
            <div className={styles.overlay}></div>
            <div className={`container ${styles.content}`}>
                <h2 className="section-title" style={{ textAlign: 'center', margin: 0, color: 'white' }}>Join the Lab</h2>
                <p className={styles.subtitle}>
                    Become a part of our dynamic research group. We are always looking for motivated individuals.
                </p>
                <div className={styles.buttonWrapper}>
                    <Link href="/join" className={styles.joinBtn}>
                        Open Join Form
                    </Link>
                </div>
            </div>
        </section>
    );
}
