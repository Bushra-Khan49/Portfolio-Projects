'use client';

import Image from 'next/image';
import Link from 'next/link';
import { facilitiesData } from '@/data/mockData';
import styles from './Facilities.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import { useState, useEffect } from 'react';

export default function Facilities() {
    const data = useLiveData('facilities', facilitiesData);
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    // Force image refresh when data changes
    useEffect(() => {
        setImgTimestamp(Date.now());
    }, [data]);

    return (
        <section id="facilities" className={`section ${styles.facilitiesSection}`}>
            <div className="container">

                <div className={styles.header}>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: 0 }}>Facilities</h2>
                </div>

                <div className={styles.grid}>
                    {data.map((facility: any) => (
                        <div key={facility.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={imgTimestamp ? `${facility.image}?t=${imgTimestamp}` : facility.image}
                                    alt={facility.title}
                                    fill
                                    className={styles.cardImage}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{facility.title}</h3>
                                <p className={styles.cardDesc}>{facility.description}</p>

                                <div className={styles.stats}>
                                    {(facility.stats || []).map((stat: any, i: number) => (
                                        <div key={i} className={styles.statBox}>
                                            <span className={styles.statLabel}>{stat.label}</span>
                                            <span className={styles.statValue}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href={`/facilities/${facility.id}`} className={styles.learnMore}>
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
