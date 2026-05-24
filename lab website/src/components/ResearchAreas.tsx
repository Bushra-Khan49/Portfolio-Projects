'use client';

import Image from 'next/image';
import Link from 'next/link';
import { researchData } from '@/data/mockData';
import styles from './ResearchAreas.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import { useState, useEffect } from 'react';
import type { ResearchArea } from '@/types';

export default function ResearchAreas() {
    const rawData = useLiveData('research', researchData) as any;
    const data = Array.isArray(rawData) ? rawData : (rawData?.areas || []);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    // Force image refresh when data changes
    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [rawData]);

    return (
        <section id="research" className={`section ${styles.researchSection}`}>
            <div className="container">

                <div className={styles.header}>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: 0, color: '#ffffff' }}>{Array.isArray(rawData) ? "Research Areas" : (rawData?.pageTitle || "Research Areas")}</h2>
                </div>

                <div className={styles.grid}>
                    {data.map((area: ResearchArea) => (
                        <div key={area.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={imgTimestamp ? `${area.image}?t=${imgTimestamp}` : area.image}
                                    alt={area.title}
                                    fill
                                    className={styles.cardImage}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{area.title}</h3>
                                <p className={styles.cardDesc}>{area.shortDesc}</p>
                                <Link href={`/research?topic=${area.id}`} className={styles.learnMore}>
                                    Explore &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                    <Link href="/research" className={styles.learnMore} style={{ fontWeight: 800, fontSize: '1.1rem', color: '#52b788' }}>
                        See All Research Areas &rarr;
                    </Link>
                </div>

            </div>
        </section>
    );
}
