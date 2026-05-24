'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft, Settings, Info, Activity, Target, Zap, Clock, CheckCircle2 } from 'lucide-react';

import { use } from 'react';

export default function FacilityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [data, setData] = useState<any>(null);
    const [strategyData, setStrategyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin-data?type=facilities').then(r => r.json()),
            fetch('/api/admin-data?type=goals').then(r => r.json())
        ]).then(([facilities, goals]) => {
            const item = facilities.find((r: any) => r.id === slug);
            const strategy = goals.find((g: any) => g.id === 'translational-scaling');
            setData(item);
            setStrategyData(strategy);
        }).finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}><Loader2 className="spinner" color="var(--color-primary)" size={40} /></div>;
    if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: 'black' }}>Facility not found.</div>;

    return (
        <main style={{ background: 'var(--admin-bg)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            <Navigation />
            
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '50vh', minHeight: '400px', width: '100%' }}>
                <Image src={data.image} alt={data.title} fill style={{ objectFit: 'cover', opacity: 0.5 }} unoptimized />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--admin-bg) 100%)' }} />
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '3rem' }}>
                    <div>
                        <Link href="/facilities" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            <ArrowLeft size={16} /> Infrastructure Index
                        </Link>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1rem' }}>{data.title}</h1>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            {/* Overview */}
                            <div style={{ padding: '3rem', background: 'var(--color-bg-light)', borderRadius: '32px', border: '1px solid var(--color-border)' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Info color="var(--color-primary)" /> Facility Overview
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>{data.longDesc || data.description}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ padding: '2.5rem', background: 'var(--color-card-bg)', borderRadius: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Activity color="var(--color-primary)" /> Operational Specs
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {data.stats?.map((stat: any, i: number) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</span>
                                            <span style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{stat.value}</span>
                                        </div>
                                    ))}
                                    {!data.stats?.length && <p style={{ color: 'var(--color-text-muted)' }}>Real-time telemetry pending...</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Width Projects - Highlight Section */}
                    {data.projects && data.projects.length > 0 && (
                        <div style={{ 
                            padding: '4rem', 
                            background: 'var(--color-bg-deep)', 
                            borderRadius: '48px', 
                            border: '1px solid var(--color-primary)',
                            boxShadow: '0 20px 50px rgba(45, 106, 79, 0.2)',
                            color: 'white'
                        }}>
                            <div style={{ marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Activity color="var(--color-accent)" size={40} /> Current Research Deployments
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>Comprehensive breakdown of active experimental protocols, environmental setpoints, and operational metrics.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {data.projects.map((project: any, idx: number) => (
                                    <div key={idx} style={{ 
                                        background: 'var(--color-card-bg)', 
                                        padding: '2rem', 
                                        borderRadius: '32px', 
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-main)',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.1rem', flexShrink: 0 }}>
                                                {idx + 1}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, marginTop: '4px', color: 'var(--color-text-main)' }}>{project.name}</h3>
                                        </div>
                                        
                                        <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'var(--color-bg-light)', borderRadius: '16px', borderLeft: '4px solid var(--color-accent)' }}>
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Operational Protocol:</span>
                                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                {Array.isArray(project.settings) ? project.settings.map((setting: any, sIdx: number) => (
                                                    <li key={sIdx} style={{ marginBottom: '6px' }}>
                                                        <strong style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>{setting.key}:</strong> {setting.value}
                                                    </li>
                                                )) : (
                                                    <li>{project.settings}</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
