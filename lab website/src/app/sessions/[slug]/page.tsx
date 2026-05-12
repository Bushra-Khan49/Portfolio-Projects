import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { sessionsData } from '@/data/mockData';

export function generateStaticParams() {
    return sessionsData.map((item) => ({
        slug: item.id,
    }));
}

export default function SessionDetailPage({ params }: { params: { slug: string } }) {
    const item = sessionsData.find((i) => i.id === params.slug);

    if (!item) notFound();

    return (
        <main>
            <Navigation />
            <article className="section" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <Link href="/#progress" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem', padding: '0.5rem 1rem' }}>
                        &larr; Back to Sessions
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ backgroundColor: 'var(--color-bg-gray)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                            {item.time}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            Presenter: {item.presenter}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
                        {item.title}
                    </h1>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-main)' }}>
                        <p>
                            This is a detailed page view for the session: {item.title}. Full abstracts and livestream links will be populated here via the Admin Dashboard.
                        </p>
                    </div>
                </div>
            </article>
            <Footer />
        </main>
    );
}
