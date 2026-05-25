import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { sessionsData } from '@/data/mockData';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return sessionsData.map((item) => ({
        slug: item.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const item = sessionsData.find((i) => i.id === slug);
    if (!item) {
        return {
            title: 'Session Not Found | Nexus Genomics Institute',
        };
    }
    return {
        title: `${item.title} | Presentations | Nexus Genomics Institute`,
        description: `Session abstract and details for "${item.title}" presented by ${item.presenter} at Nexus Genomics Institute.`,
        openGraph: {
            title: `${item.title} | Presentations | Nexus Genomics Institute`,
            description: `Session abstract and details for "${item.title}" presented by ${item.presenter} at Nexus Genomics Institute.`,
        }
    };
}

export default async function SessionDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const item = sessionsData.find((i) => i.id === slug);

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
