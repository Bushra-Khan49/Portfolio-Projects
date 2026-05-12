import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { facilitiesData } from '@/data/mockData';

export function generateStaticParams() {
    return facilitiesData.map((item) => ({
        slug: item.id,
    }));
}

export default function FacilityDetailPage({ params }: { params: { slug: string } }) {
    const item = facilitiesData.find((i) => i.id === params.slug);

    if (!item) notFound();

    return (
        <main>
            <Navigation />
            <article className="section" style={{ paddingTop: '10rem', minHeight: '80vh', backgroundColor: 'var(--color-bg-white)' }}>
                <div className="container">
                    <Link href="/#facilities" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '3rem', padding: '0.5rem 1rem' }}>
                        &larr; Back to Facilities
                    </Link>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                        {/* Left Content */}
                        <div>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)', fontWeight: 800, lineHeight: 1.1 }}>
                                {item.title}
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>
                                {item.description}
                            </p>

                            <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '2rem', borderRadius: '12px' }}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facility Specifications</h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {item.stats.map((stat, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{stat.label}</span>
                                            <span style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Media */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </article>
            <Footer />
        </main>
    );
}
