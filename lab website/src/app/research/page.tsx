'use client';

/**
 * 🔬 RESEARCH AREAS – Connected Dashboard Layout
 * -----------------------------------------------
 * - Left sidebar: vertical tabs with bridge effect.
 * - Right card: floating dashboard, text left / image right.
 * - Reads ?topic= query param so homepage Explore buttons
 *   open the correct card directly.
 */

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { researchData } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ResearchAreasPage.module.css';

// ─── Inner content (needs useSearchParams inside Suspense) ─
function ResearchContent() {
    const searchParams = useSearchParams();
    const topicParam = searchParams.get('topic');

    const defaultId =
        topicParam && researchData.find(r => r.id === topicParam)
            ? topicParam
            : researchData[0].id;

    const [activeId, setActiveId] = useState(defaultId);

    const activeArea = researchData.find(item => item.id === activeId)!;
    const activeIndex = researchData.findIndex(item => item.id === activeId);

    return (
        <>
            {/* ── Centred Header ─────────────────────────────── */}
            <div className="container">
                <header className={styles.pageHeader}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.mainTitle}
                    >
                        Research Areas
                    </motion.h1>

                    {/* Single blue accent line after title */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={styles.titleLine}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className={styles.subtitle}
                    >
                        Exploring the molecular frontiers of herbal genomics and plant systems
                        biology to unlock nature&apos;s therapeutic potential.
                    </motion.p>
                </header>
            </div>

            {/* ── Left-aligned Dashboard Layout ─────────────── */}
            <div className={styles.mainSection}>
                <div className={styles.layout}>

                    {/* ── Sidebar (vertical tab nav) ──────────── */}
                    <aside className={styles.sidebar}>
                        <p className={styles.sidebarLabel}>Focus Areas</p>
                        <nav className={styles.nav}>
                            {researchData.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveId(item.id)}
                                    className={`${styles.navBtn} ${activeId === item.id ? styles.navBtnActive : ''}`}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* ── Floating Dashboard Card ──────────────── */}
                    <div className={styles.card}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    minHeight: '480px',
                                }}
                            >
                                {/* LEFT: Text Content */}
                                <div className={styles.textSide}>
                                    {/* Neumorphic pill — shows "Topic 01", "Topic 02" etc. */}
                                    <span className={styles.topicPill}>
                                        Topic {String(activeIndex + 1).padStart(2, '0')}
                                    </span>

                                    {/* Full topic name in styled heading */}
                                    <h2 className={styles.cardTitle}>
                                        {activeArea.title}
                                    </h2>
                                    <div className={styles.cardTitleLine} />

                                    {/* Full longDesc */}
                                    <p className={styles.cardDesc}>
                                        {activeArea.longDesc || activeArea.shortDesc}
                                    </p>
                                </div>

                                {/* RIGHT: Image (no corner modifications) */}
                                <div className={styles.imageSide}>
                                    <Image
                                        src={activeArea.image}
                                        alt={activeArea.title}
                                        fill
                                        className={styles.imageEl}
                                        style={{ objectFit: 'cover' }}
                                        unoptimized
                                        priority
                                    />

                                    {/* Badge on top of image — bottom-right corner */}
                                    <div className={styles.stepBadge}>
                                        {String(activeIndex + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </>
    );
}

// ─── Page wrapper ────────────────────────────────────
export default function ResearchAreasPage() {
    return (
        <div className={styles.pageWrapper}>
            <Navigation />
            <Suspense fallback={<div style={{ height: '80vh' }} />}>
                <ResearchContent />
            </Suspense>
            <Footer />
        </div>
    );
}
