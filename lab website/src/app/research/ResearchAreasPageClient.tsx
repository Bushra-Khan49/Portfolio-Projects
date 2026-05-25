'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ResearchAreasPage.module.css';

// ─── Inner content (needs useSearchParams inside Suspense) ─
function ResearchContent() {
    const searchParams = useSearchParams();
    const topicParam = searchParams.get('topic');

    const [researchData, setResearchData] = useState<any[]>([]);
    const [pageTitle, setPageTitle] = useState('Research Areas');
    const [pageSubtitle, setPageSubtitle] = useState('Exploring the molecular frontiers of herbal genomics and plant systems biology to unlock nature\'s therapeutic potential.');
    const [sidebarLabel, setSidebarLabel] = useState('Focus Areas');
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/v1/admin-data?type=research')
            .then(r => r.json())
            .then(data => {
                const areas = Array.isArray(data) ? data : (data?.areas || []);
                const title = Array.isArray(data) ? 'Research Areas' : (data?.pageTitle || 'Research Areas');
                const subtitle = Array.isArray(data) 
                    ? 'Exploring the molecular frontiers of herbal genomics and plant systems biology to unlock nature\'s therapeutic potential.' 
                    : (data?.pageSubtitle || '');
                const label = Array.isArray(data) ? 'Focus Areas' : (data?.sidebarLabel || 'Focus Areas');

                setResearchData(areas);
                setPageTitle(title);
                setPageSubtitle(subtitle);
                setSidebarLabel(label);

                if (areas && areas.length > 0) {
                    const defaultId = topicParam && areas.find((r: any) => r.id === topicParam)
                        ? topicParam
                        : areas[0].id;
                    setActiveId(defaultId);
                }
            });
    }, [topicParam]);

    if (!activeId || researchData.length === 0) return null;

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
                        {pageTitle}
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
                        {pageSubtitle}
                    </motion.p>
                </header>
            </div>

            {/* ── Left-aligned Dashboard Layout ─────────────── */}
            <div className={styles.mainSection}>
                <div className={styles.layout}>

                    {/* ── Sidebar (vertical tab nav) ──────────── */}
                    <aside className={styles.sidebar}>
                        <p className={styles.sidebarLabel}>{sidebarLabel}</p>
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
                                className={styles.cardInner}
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

export default function ResearchAreasPageClient() {
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
