import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { researchData } from '@/data/mockData';

// Generate static params for all known research areas at build time
export function generateStaticParams() {
    return researchData.map((item) => ({
        slug: item.id,
    }));
}

export default function ResearchDetailPage({ params }: { params: { slug: string } }) {
    const researchItem = researchData.find((item) => item.id === params.slug);

    if (!researchItem) {
        notFound();
    }

    return (
        <main>
            <Navigation />

            {/* Blank Shell for Research Details */}
            <article 
                className="section" 
                style={{ 
                    paddingTop: '10rem', 
                    minHeight: '80vh', 
                    backgroundColor: 'var(--color-bg-white)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div className="container">
                    <Link href="/#research" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '3rem', padding: '0.5rem 1rem' }}>
                        &larr; Back to Research
                    </Link>

                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{ 
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                            color: 'var(--color-text-main)', 
                            fontWeight: 800, 
                            marginBottom: '2rem',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            {researchItem.title}
                        </h1>
                        
                        <div style={{ 
                            width: '60px', 
                            height: '4px', 
                            backgroundColor: 'var(--color-primary)', 
                            margin: '0 auto 3rem' 
                        }} />

                        {/* This area is ready for the content you want to add next */}
                        <div style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.2rem',
                            fontStyle: 'italic',
                            padding: '4rem 2rem',
                            border: '1px dashed var(--color-border)',
                            borderRadius: '16px'
                        }}>
                            This section is currently being updated. Please check back soon for detailed insights into our {researchItem.title} initiatives.
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
