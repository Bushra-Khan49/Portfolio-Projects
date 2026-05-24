'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Loader2, ArrowLeft, Target, TrendingUp, Calendar } from 'lucide-react';

import { use } from 'react';

export default function GoalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/v1/admin-data?type=goals')
            .then(r => r.json())
            .then(res => {
                const item = res.find((r: any) => r.id === slug);
                setData(item);
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}><Loader2 className="spinner" color="var(--color-primary)" size={40} /></div>;
    if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: 'black' }}>Strategic goal not found.</div>;

    return (
        <main style={{ background: 'var(--admin-bg)', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            <Navigation />
            
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '50vh', minHeight: '400px', width: '100%' }}>
                <Image src={data.image} alt={data.title} fill style={{ objectFit: 'cover', opacity: 0.5 }} unoptimized />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--admin-bg) 100%)' }} />
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '3rem' }}>
                    <div>
                        <Link href="/goals" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            <ArrowLeft size={16} /> Strategy Roadmap
                        </Link>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--color-text-main)', marginBottom: '1rem', lineHeight: 1.1 }}>{data.title}</h1>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ padding: '4rem 0 4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '4rem' }}>
                        
                        {/* Left Column: Description */}
                        <div>
                            <div style={{ position: 'sticky', top: '100px', padding: '3rem', background: 'var(--color-bg-light)', borderRadius: '32px', border: '1px solid var(--color-border)' }}>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>{data.longDesc || data.description}</p>
                            </div>
                        </div>

                        {/* Right Column: Progress & Timeline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
                            
                            {/* Mini Progress Bar */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1.5rem', 
                                padding: '1.25rem 2rem', 
                                background: 'var(--color-card-bg)', 
                                borderRadius: '32px',
                                border: '1px solid var(--color-border)', 
                                boxShadow: 'var(--shadow-sm)',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                    <TrendingUp size={18} color="var(--color-primary)" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-primary)', marginLeft: '0.5rem' }}>{data.progress}%</span>
                                </div>
                                
                                <div style={{ flex: 1, height: '8px', background: 'var(--color-bg-gray)', borderRadius: '10px', overflow: 'hidden', minWidth: '100px' }}>
                                    <div style={{ height: '100%', width: `${data.progress}%`, background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))', borderRadius: '10px' }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)' }}>
                                    <Calendar size={16} color="var(--color-text-muted)" />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Target: <strong style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>{data.target}</strong></span>
                                </div>
                            </div>

                            {/* Horizontal Phase Timeline */}
                            {data.breakdown && data.breakdown.length > 0 && (
                                <div style={{ 
                                    padding: '3rem', 
                                    background: 'var(--color-bg-deep)', 
                                    borderRadius: '48px', 
                                    border: '1px solid var(--color-primary)',
                                    boxShadow: '0 20px 50px rgba(45, 106, 79, 0.2)',
                                    color: 'white',
                                    maxHeight: '600px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Target color="var(--color-accent)" size={32} /> Project Phases
                                        </h2>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Scroll to explore the global execution timeline.</p>
                                    </div>

                                    <div 
                                        onScroll={(e) => {
                                            const el = e.currentTarget;
                                            const maxScroll = el.scrollHeight - el.clientHeight;
                                            const scrollPercentage = maxScroll > 0 ? (el.scrollTop / maxScroll) * 100 : 0;
                                            const fill = document.getElementById('timeline-fill');
                                            const ball = document.getElementById('timeline-ball');
                                            if (fill) fill.style.height = `${scrollPercentage}%`;
                                            if (ball) {
                                                ball.style.top = `calc(${scrollPercentage}% - 8px)`;
                                                const ballRect = ball.getBoundingClientRect();
                                                const nodes = document.querySelectorAll('.phase-node');
                                                nodes.forEach((node: any) => {
                                                    const nodeRect = node.getBoundingClientRect();
                                                    const centerBall = ballRect.top + ballRect.height / 2;
                                                    const centerNode = nodeRect.top + nodeRect.height / 2;
                                                    if (Math.abs(centerBall - centerNode) < 40) {
                                                        node.style.setProperty('--glow-shadow', '0 0 25px 10px rgba(255, 255, 255, 0.8), 0 0 40px rgba(16, 185, 129, 1)');
                                                        node.style.setProperty('--glow-scale', 'scale(1.4)');
                                                        node.style.setProperty('--glow-bg', 'white');
                                                    } else {
                                                        node.style.removeProperty('--glow-shadow');
                                                        node.style.removeProperty('--glow-scale');
                                                        node.style.removeProperty('--glow-bg');
                                                    }
                                                });
                                            }
                                        }}
                                        style={{ 
                                            overflowY: 'auto',
                                            paddingRight: '1rem',
                                            flex: 1,
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(255,255,255,0.2) transparent'
                                        }}
                                    >
                                        <div style={{
                                            position: 'relative', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: '3rem',
                                        }}>
                                        
                                        {/* Vertical Timeline Nerve Line */}
                                        <div style={{ 
                                            position: 'absolute', 
                                            top: '90px', 
                                            bottom: '90px', 
                                            left: '40px', 
                                            width: '4px', 
                                            background: 'rgba(255,255,255,0.1)', 
                                            zIndex: 0,
                                            borderRadius: '2px'
                                        }}>
                                            {/* Dynamic Progress Fill linked to Scroll */}
                                            <div 
                                                id="timeline-fill"
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    width: '100%',
                                                    height: `0%`,
                                                    background: 'var(--color-accent)',
                                                    borderRadius: '2px',
                                                    boxShadow: '0 0 10px var(--color-accent)',
                                                    zIndex: 1
                                                }} 
                                            />
                                            
                                            {/* Glowing Scroll Indicator Ball */}
                                            <div 
                                                id="timeline-ball"
                                                style={{
                                                    position: 'absolute',
                                                    top: `calc(0% - 8px)`,
                                                    left: '-6px',
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    boxShadow: '0 0 15px 5px rgba(16, 185, 129, 0.8)',
                                                    zIndex: 10
                                                }} 
                                            />
                                        </div>

                                        {data.breakdown.map((phase: any, idx: number) => {
                                            const parts = phase.lastUpdated ? phase.lastUpdated.split(' ') : ['TBD', ''];
                                            const month = parts[0];
                                            const year = parts[1] || '';
                                            
                                            return (
                                                <div key={idx} style={{ 
                                                    position: 'relative', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '3rem',
                                                    zIndex: 20
                                                }}>
                                                    {/* Timeline Date & Node cluster */}
                                                    <div style={{ 
                                                        width: '84px', 
                                                        flexShrink: 0, 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        alignItems: 'center' 
                                                    }}>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            flexDirection: 'column', 
                                                            alignItems: 'center',
                                                            background: 'var(--color-bg-deep)',
                                                            padding: '4px 0',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <span style={{ fontSize: '1rem', color: 'white', fontWeight: 900, marginBottom: '2px' }}>{year}</span>
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{month}</span>
                                                        </div>
                                                        
                                                        <div 
                                                            className="phase-node"
                                                            style={{ 
                                                                width: '24px', 
                                                                height: '24px', 
                                                                borderRadius: '50%', 
                                                                background: 'var(--glow-bg, #1b4332)',
                                                                border: '4px solid var(--color-bg-deep)',
                                                                boxShadow: 'var(--glow-shadow, none)',
                                                                transform: 'var(--glow-scale, scale(1))',
                                                                position: 'relative',
                                                                zIndex: 2,
                                                                transition: 'all 0.3s ease'
                                                            }} 
                                                        />
                                                    </div>

                                                    {/* Phase Card */}
                                                    <div style={{ 
                                                        flex: 1,
                                                        background: 'var(--color-card-bg)', 
                                                        padding: '1.75rem', 
                                                        borderRadius: '24px', 
                                                        border: '1px solid var(--color-border)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '0.75rem',
                                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>{phase.label}</span>
                                                        </div>
                                                        
                                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.4 }}>{phase.desc}</p>
                                                        
                                                        <div style={{ padding: '0.75rem 1rem', background: 'var(--color-bg-light)', borderRadius: '12px', borderLeft: '3px solid var(--color-accent)', margin: '0.5rem 0' }}>
                                                            <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>TARGET:</span>
                                                            <p style={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>{phase.plan}</p>
                                                        </div>

                                                        <div style={{ marginTop: '0.5rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 800 }}>{phase.achieved} DONE</span>
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, background: 'var(--color-bg-white)', padding: '2px 8px', borderRadius: '6px' }}>{phase.lastUpdated}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.3 }}>{phase.details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
