import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { goalsData } from '@/data/mockData';

export function generateStaticParams() {
    return goalsData.map((item) => ({
        slug: item.id,
    }));
}

export default function GoalDetailPage({ params }: { params: { slug: string } }) {
    const item = goalsData.find((i) => i.id === params.slug);

    if (!item) notFound();

    return (
        <main>
            <Navigation />
            <article className="section" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <Link href="/#goals" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem', padding: '0.5rem 1rem' }}>
                        &larr; Back to Goals
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                            {item.progress}% Complete
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            Target: {item.target}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
                        {item.title}
                    </h1>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-main)' }}>
                        <p>
                            This is a detailed page view for tracking the goal: {item.title}. Detailed progress logs and milestones will be mapped here from the administrative dashboard once the CMS database is finalized.
                        </p>
                    </div>
                </div>
            </article>
            <Footer />
        </main>
    );
}
