'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { facilitiesData } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLiveData } from '@/hooks/useLiveData';
import styles from './FacilitiesPage.module.css';

function FacilitiesContent() {
    const searchParams = useSearchParams();
    const facilityParam = searchParams.get('id');

    const liveFacilities = useLiveData('facilities', facilitiesData);

    const defaultId =
        facilityParam && liveFacilities.find((f: any) => f.id === facilityParam)
            ? facilityParam
            : liveFacilities[0].id;

    const [activeId, setActiveId] = useState(defaultId);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    // Force image refresh when data changes
    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [liveFacilities]);

    const activeFacility = liveFacilities.find((item: any) => item.id === activeId);
    const activeIndex = liveFacilities.findIndex((item: any) => item.id === activeId);

    if (!activeFacility || activeIndex === -1) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <Loader2 size={32} className="spinner" />
                <span style={{ marginLeft: '1rem' }}>Synchronizing infrastructure data...</span>
            </div>
        );
    }

    return (
        <>
            <div className="container">
                <header className={styles.pageHeader}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={styles.mainTitle}
                    >
                        World-Class Facilities
                    </motion.h1>
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
                        Advanced technological infrastructure empowering the next generation 
                        of biological discovery and computational innovation.
                    </motion.p>
                </header>
            </div>

            <div className={styles.mainSection}>
                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <p className={styles.sidebarLabel}>Our Infrastructure</p>
                        <nav className={styles.nav}>
                            {liveFacilities.map((item: any) => (
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
                                <div className={styles.textSide}>
                                    <span className={styles.topicPill}>
                                        Facility {String(activeIndex + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className={styles.cardTitle}>
                                        {activeFacility.title}
                                    </h2>
                                    <div className={styles.cardTitleLine} />
                                    <p className={styles.cardDesc}>
                                        {activeFacility.longDesc || activeFacility.description}
                                    </p>
                                    
                                     {activeFacility.stats && (
                                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {activeFacility.stats.map((stat: any, idx: number) => (
                                                <div key={idx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                                                    <p style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0.25rem 0 0 0' }}>{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.imageSide}>
                                    <Image
                                        src={imgTimestamp ? `${activeFacility.image}${activeFacility.image.includes('?') ? '&' : '?'}t=${imgTimestamp}` : activeFacility.image}
                                        alt={activeFacility.title}
                                        fill
                                        className={styles.imageEl}
                                        style={{ objectFit: 'cover' }}
                                        unoptimized
                                        priority
                                    />
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

export default function FacilitiesPage() {
    return (
        <div className={styles.pageWrapper}>
            <Navigation />
            <Suspense fallback={<div style={{ height: '80vh' }} />}>
                <FacilitiesContent />
            </Suspense>
            <Footer />
        </div>
    );
}
