import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AboutData } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import { 
    MessageSquare, 
    Target, 
    Compass, 
    History, 
    ChevronRight,
    Quote
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | Nexus Genomics Institute',
    description: 'Learn about our mission, vision, and the biological revolution we are leading at Nexus Genomics Institute.',
};

async function getAboutData(): Promise<AboutData> {
    const filePath = path.join(process.cwd(), 'src/data/about.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
}

export default async function AboutPage() {
    const data = await getAboutData();

    return (
        <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Navigation />
            
            {/* Hero Section */}
            <section style={{ 
                position: 'relative', height: '60vh', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', overflow: 'hidden', backgroundColor: '#0f172a' 
            }}>
                <Image 
                    src="/nexus_lab_hero_bg_1778825057557.png" 
                    alt="Nexus Lab Interior" 
                    fill 
                    style={{ objectFit: 'cover', opacity: 0.4 }} 
                    priority
                />
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', padding: '0 1.5rem' }}>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Decoding the Language of Life</h1>
                    <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', opacity: 0.8, maxWidth: '800px', margin: '0 auto' }}>Leading the interdisciplinary revolution in genomics and herbal omics research.</p>
                </div>
            </section>

            {/* Director's Speech */}
            <section style={{ padding: '8rem 0', backgroundColor: 'white' }}>
                <div className="container">
                    <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', height: '600px', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-float)' }}>
                            <Image 
                                src="/nexus_about_vision_1778827972431.png" 
                                alt="Our Team Vision" 
                                fill 
                                style={{ objectFit: 'cover' }} 
                            />
                        </div>
                        <div style={{ position: 'relative', padding: '4rem', backgroundColor: '#f1f5f9', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                            <Quote size={80} color="var(--color-primary)" style={{ opacity: 0.1, position: 'absolute', top: '2rem', left: '2rem' }} />
                            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-main)', lineHeight: 1.1 }}>{data.speech.title}</h2>
                            <div style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '3rem', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                                "{data.speech.content}"
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{data.speech.author}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{data.speech.designation}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section style={{ padding: '8rem 0', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                        {/* Mission */}
                        <div style={{ backgroundColor: 'white', padding: '4rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(30, 58, 138, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>
                                <Target size={32} />
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{data.mission.title}</h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{data.mission.content}</p>
                        </div>

                        {/* Vision */}
                        <div style={{ backgroundColor: 'white', padding: '4rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(15, 23, 42, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: 'var(--color-secondary)' }}>
                                <Compass size={32} />
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{data.vision.title}</h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{data.vision.content}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section style={{ padding: '8rem 0', backgroundColor: 'white' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Our Journey</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>Key milestones in our quest for scientific excellence.</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '19px', top: 0, bottom: 0, width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
                        {data.history.map((h, i) => (
                            <div key={i} style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    backgroundColor: 'white', border: '4px solid var(--color-primary)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{h.year}</div>
                                    <div style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', fontWeight: 600 }}>{h.event}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
