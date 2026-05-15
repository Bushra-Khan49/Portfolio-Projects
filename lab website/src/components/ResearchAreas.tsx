'use client';

import Image from 'next/image';
import Link from 'next/link';
import { researchData } from '@/data/mockData';
import styles from './ResearchAreas.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import { useState, useEffect } from 'react';
import type { ResearchArea } from '@/types';

export default function ResearchAreas() {
    const data = useLiveData('research', researchData);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    // Force image refresh when data changes
    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [data]);

    return (
        <section id="research" className={`section ${styles.researchSection}`}>
            <div className="container">

                <div className={styles.header}>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: 0, color: 'var(--color-text-inverse)' }}>Research Areas</h2>
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

            </div>
        </section>
    );
}
