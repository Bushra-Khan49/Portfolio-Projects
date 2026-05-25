'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Target, FileText } from 'lucide-react';

export default function ResearchDetailPageClient({ data }: { data: any }) {
    return (
        <main style={{ background: 'white', minHeight: '100vh' }}>
            <Navigation />
            
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '60vh', minHeight: '500px', width: '100%' }}>
                <Image src={data.image} alt={data.title} fill style={{ objectFit: 'cover', opacity: 0.4 }} unoptimized />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%)' }} />
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '4rem' }}>
                    <div style={{ maxWidth: '800px' }}>
                        <Link href="/research" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                            <ArrowLeft size={16} /> Back to Research
                        </Link>
                        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, color: 'var(--color-text-main)', lineHeight: 1, marginBottom: '1.5rem' }}>{data.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{data.shortDesc}</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container">
                    <div className="detail-layout-grid-research">
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FileText color="var(--color-primary)" /> Detailed Analysis
                            </h2>
                            <div style={{ fontSize: '1.15rem', lineHeight: 1.9, color: 'var(--color-text-main)', whiteSpace: 'pre-wrap' }}>
                                {data.longDesc || data.shortDesc}
                            </div>
                        </div>

                        <aside>
                            <div style={{ padding: '2.5rem', background: 'rgba(30,41,59,0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Target color="var(--color-accent)" /> Focus Metrics
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Category</p>
                                        <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Genomic Systems Biology</p>
                                    </div>
                                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Status</p>
                                        <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Active Initiative</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Priority</p>
                                        <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>High Impact</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
