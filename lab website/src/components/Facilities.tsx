'use client';

import Image from 'next/image';
import Link from 'next/link';
import { facilitiesData } from '@/data/mockData';
import styles from './Facilities.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import { useState, useEffect } from 'react';
import type { Facility } from '@/types';

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
                    {data.map((facility: Facility) => (
                        <div key={facility.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={imgTimestamp ? `${facility.image}${facility.image.includes('?') ? '&' : '?'}t=${imgTimestamp}` : facility.image}
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


                                <Link href={`/facilities/${facility.id}`} className={styles.learnMore}>
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                    <Link href="/facilities" className={styles.learnMore} style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-see-all-btn)' }}>
                        Explore All Facilities &rarr;
                    </Link>
                </div>

            </div>
        </section>
    );
}
