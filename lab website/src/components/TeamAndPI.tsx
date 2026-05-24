'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { teamData } from '@/data/mockData';
import styles from './TeamAndPI.module.css';
import { useLiveData } from '@/hooks/useLiveData';
import type { TeamMember, Publication } from '@/types';

// Helper to generate member keys matching the admin dashboard logic
function getMemberKey(role: string, name?: string): string {
    if (!name) return `member-${role}-${Math.random().toString(36).substr(2, 5)}`;
    const prefix = role === 'phd' ? 'phd' : role === 'ra' ? 'ra' : 'intern';
    return `${prefix}-${name.toLowerCase().replace(/\s+/g, '-')}`;
}

// Circle image component — cache-busted so updated photos show instantly
function CircleImage({ src, alt, size }: { src?: string; alt: string; size: number }) {
    const [ts, setTs] = useState<number | null>(null);
    useEffect(() => { if (src) setTs(Date.now()); }, [src]);
    if (!src) return <div style={{ width: size, height: size, backgroundColor: '#f1f5f9', borderRadius: '50%' }} />;
    return (
        <Image
            src={ts ? `${src}?t=${ts}` : src}
            alt={alt}
            width={size}
            height={size}
            className={styles.circleImage}
            unoptimized
        />
    );
}

export default function TeamAndPI() {
    // Sync PI Data and Team Lists via useLiveData
    const pi = useLiveData('pi', teamData.pi);
    const team = useLiveData('team', teamData);

    // Team images are served from /api/team-images (not /api/admin-data)
    const [teamImages, setTeamImages] = useState<Record<string, string>>({});
    const [imgTimestamp, setImgTimestamp] = useState<number | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/v1/team-images');
                if (res.ok) {
                    const data = await res.json();
                    setTeamImages(data);
                    setImgTimestamp(Date.now());
                }
            } catch { /* silent */ }
        };
        fetchImages();
        const interval = setInterval(fetchImages, 60000);
        return () => clearInterval(interval);
    }, []);

    const publications = pi.publications || [];

    return (
        <>
            {/* Full PI Details Section — uses pi-detail key */}
            <section id="about" className={`section ${styles.piDetailsSection}`}>
                <div className="container">
                    <div className={styles.piContainer}>
                        <div className={styles.piImageWrapper}>
                            {teamImages['pi-detail'] ? (
                                <Image
                                    src={imgTimestamp ? `${teamImages['pi-detail']}?t=${imgTimestamp}` : teamImages['pi-detail']}
                                    alt={pi.name}
                                    fill
                                    className={styles.piMainImage}
                                    unoptimized
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9' }} />
                            )}
                        </div>

                        <div className={styles.piInfo}>
                            <h2 className={styles.piNameFull}>{pi.name}</h2>
                            <h3 className={styles.piRoleFull}>{pi.role}</h3>
                            <p className={styles.piAffiliation}>{pi.affiliation}</p>

                            <div className={styles.piContact}>
                                <p>Email: {pi.email} | {pi.altEmail}</p>
                                <p>Location: {pi.location}</p>
                            </div>

                            <blockquote className={styles.piQuote}>
                                {pi.quote}
                            </blockquote>

                            <div className={styles.piPublication}>
                                <span className={styles.pubSubtitle}>Selected Publications</span>
                                {publications.filter((p: Publication) => p.title.trim()).length > 0 ? (
                                    <ul className={styles.pubList}>
                                        {publications.filter((p: Publication) => p.title.trim()).map((pub: Publication) => (
                                            <li key={pub.id} className={styles.pubItem}>
                                                <div className={styles.pubBullet} />
                                                {pub.link ? (
                                                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.pubLink}>
                                                        {pub.title}
                                                    </a>
                                                ) : (
                                                    <span className={styles.pubTitle}>{pub.title}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className={styles.pubItem}>
                                        <div className={styles.pubBullet} />
                                        <p className={styles.piAffiliation} style={{ fontStyle: 'italic', margin: 0 }}>{pi.featuredPublication}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Hierarchical Tree */}
            <section id="team" className={`section ${styles.teamSection}`}>
                <div className="container">
                    <div className={styles.membersHeader}>
                        <h2 className="section-title" style={{ textAlign: 'center', margin: 0 }}>Meet Our Team</h2>
                    </div>

                    <div className={styles.treeContainer}>

                        {/* Level 1: Principal Investigator — uses pi-tree key */}
                        <div className={styles.treeLevel}>
                            <h3 className={styles.levelTitle}>Principal Investigator</h3>
                            <div className={styles.nodesGrid}>
                                <div className={`${styles.personCard} ${styles.piTreeCard}`}>
                                    <div className={`${styles.circlePhotoSlot} ${styles.piPhotoSlot}`}>
                                        <CircleImage src={teamImages['pi-tree']} alt={pi.name} size={180} />
                                    </div>
                                    <h4 className={styles.piName}>{pi.name}</h4>
                                    <p className={styles.piRole}>{pi.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Level 2: PhD Scholars */}
                        <div className={styles.treeLevel}>
                            <h3 className={styles.levelTitle}>PhD Scholars</h3>
                            <div className={styles.nodesGrid}>
                                {(team.phdScholars || []).filter((m: TeamMember) => m && m.name).map((member: TeamMember) => {
                                    const key = getMemberKey('phd', member.name);
                                    return (
                                        <div key={member.id} className={styles.personCard}>
                                            <div className={styles.circlePhotoSlot}>
                                                <CircleImage src={teamImages[key]} alt={member.name} size={140} />
                                            </div>
                                            <h4 className={styles.personName}>{member.name}</h4>
                                            <p className={styles.personRole}>{member.role || 'PhD Scholar'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Level 3: Research Associates */}
                        <div className={styles.treeLevel}>
                            <h3 className={styles.levelTitle}>Research Associates</h3>
                            <div className={styles.nodesGrid}>
                                {(team.researchAssociates || []).filter((m: TeamMember) => m && m.name).map((member: TeamMember) => {
                                    const key = getMemberKey('ra', member.name);
                                    return (
                                        <div key={member.id} className={styles.personCard}>
                                            <div className={styles.circlePhotoSlot}>
                                                <CircleImage src={teamImages[key]} alt={member.name} size={140} />
                                            </div>
                                            <h4 className={styles.personName}>{member.name}</h4>
                                            <p className={styles.personRole}>{member.role || 'Research Associate'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Level 4: Interns */}
                        <div className={styles.treeLevel}>
                            <h3 className={styles.levelTitle}>Interns</h3>
                            <div className={styles.nodesGrid}>
                                {(team.interns || []).filter((m: TeamMember) => m && m.name).map((member: TeamMember) => {
                                    const key = getMemberKey('intern', member.name);
                                    return (
                                        <div key={member.id} className={styles.personCard}>
                                            <div className={styles.circlePhotoSlot}>
                                                <CircleImage src={teamImages[key]} alt={member.name} size={140} />
                                            </div>
                                            <h4 className={styles.personName}>{member.name}</h4>
                                            <p className={styles.personRole}>{member.role || 'Intern'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
