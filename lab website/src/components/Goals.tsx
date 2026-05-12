'use client';

import Link from 'next/link';
import Image from 'next/image';
import { goalsData } from '@/data/mockData';
import styles from './Goals.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import { useState, useEffect } from 'react';

export default function Goals() {
    const data = useLiveData('goals', goalsData);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [data]);

    return (
        <section id="goals" className={`section ${styles.goalsSection}`}>
            <div className="container">

                <div className={styles.header}>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: 0 }}>Strategic Goals</h2>
                </div>

                <div className={styles.grid}>
                    {data.map((goal: any) => (
                        <div key={goal.id} className={styles.goalCard}>
                            <Image
                                src={imgTimestamp ? `${goal.image}?t=${imgTimestamp}` : goal.image}
                                alt={goal.title}
                                fill
                                className={styles.cardImage}
                                unoptimized
                            />
                            <div className={styles.overlay}></div>

                            <div className={styles.cardContent}>
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.goalTitle}>{goal.title}</h3>
                                    <span className={styles.goalTarget}>Target: {goal.target}</span>
                                </div>

                                <div className={styles.expandedContent}>
                                    <p className={styles.goalDesc}>{goal.description}</p>
                                    <div className={styles.progressContainer}>
                                        <div className={styles.progressBarWrapper}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className={styles.progressText}>{goal.progress}%</span>
                                    </div>
                                    <Link href={`/goals/${goal.id}`} className={styles.learnMore}>
                                        Explore Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href="/#goals" className={styles.seeAll}>
                        See All Goals &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
}
