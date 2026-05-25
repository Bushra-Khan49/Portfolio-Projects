'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { goalsData } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLiveData } from '@/hooks/useLiveData';
import styles from './GoalsPage.module.css';

function GoalsContent() {
    const searchParams = useSearchParams();
    const goalParam = searchParams.get('id');

    const liveGoals = useLiveData('goals', goalsData);

    const defaultId =
        goalParam && liveGoals.find((g: any) => g.id === goalParam)
            ? goalParam
            : liveGoals[0].id;

    const [activeId, setActiveId] = useState(defaultId);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    // Force image refresh when data changes
    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [liveGoals]);

    const activeGoal = liveGoals.find((item: any) => item.id === activeId);
    const activeIndex = liveGoals.findIndex((item: any) => item.id === activeId);

    if (!activeGoal || activeIndex === -1) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <Loader2 size={32} className="spinner" />
                <span style={{ marginLeft: '1rem' }}>Synchronizing strategic roadmap...</span>
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
                        Strategic Goals & Progress
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
                        Tracking our journey towards transformative biological insights 
                        and sustainable innovation through measurable milestones.
                    </motion.p>
                </header>
            </div>

            <div className={styles.mainSection}>
                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <p className={styles.sidebarLabel}>Our Roadmap</p>
                        <nav className={styles.nav}>
                            {liveGoals.map((item: any) => (
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
                                        Strategic Goal {String(activeIndex + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className={styles.cardTitle}>
                                        {activeGoal.title}
                                    </h2>
                                    <div className={styles.cardTitleLine} />
                                    <p className={styles.cardDesc}>
                                        {activeGoal.longDesc || activeGoal.description}
                                    </p>
                                    
                                     <div style={{ marginTop: '2.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(15, 23, 42, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Progress</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-primary)' }}>{activeGoal.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${activeGoal.progress}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
                                                />
                                            </div>
                                            
                                             <div style={{ marginTop: '2rem' }}>
                                                 <Link href={`/goals/${activeGoal.id}`} style={{ 
                                                     display: 'inline-flex', 
                                                     alignItems: 'center', 
                                                     justifyContent: 'center',
                                                     padding: '1rem 2rem', 
                                                     background: 'var(--color-primary)', 
                                                     color: 'white', 
                                                     fontWeight: 800, 
                                                     borderRadius: '50px',
                                                     textDecoration: 'none',
                                                     transition: 'all 0.3s ease',
                                                     boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                                                 }}>
                                                     Explore Full Execution Timeline &rarr;
                                                 </Link>
                                             </div>

                                             <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                 Target Completion: <span style={{ color: '#0f172a', fontWeight: '600' }}>{activeGoal.target}</span>
                                             </p>
                                         </div>
                                </div>

                                <div className={styles.imageSide}>
                                    <Image
                                        src={imgTimestamp ? `${activeGoal.image}${activeGoal.image.includes('?') ? '&' : '?'}t=${imgTimestamp}` : activeGoal.image}
                                        alt={activeGoal.title}
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

export default function GoalsPageClient() {
    return (
        <div className={styles.pageWrapper}>
            <Navigation />
            <Suspense fallback={<div style={{ height: '80vh' }} />}>
                <GoalsContent />
            </Suspense>
            <Footer />
        </div>
    );
}
