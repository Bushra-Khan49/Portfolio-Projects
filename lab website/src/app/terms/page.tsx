import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | Nexus Genomics Institute',
    description: 'Terms of use for the Nexus Genomics Institute website.',
};

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--admin-bg)', fontFamily: 'var(--font-sans)' }}>
            <div className="container" style={{ maxWidth: '800px', padding: '6rem 1.5rem 4rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2rem', fontSize: '0.9rem' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Terms of Use</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>Last updated: May 15, 2026</p>

                <div style={{ lineHeight: 1.8, color: 'var(--color-text-main)', fontSize: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '1rem' }}>By accessing the Nexus Genomics Institute website, you agree to comply with these terms. If you do not agree, please refrain from using this site.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>2. Intellectual Property</h2>
                    <p style={{ marginBottom: '1rem' }}>All content on this website, including text, images, and research data, is the property of Nexus Genomics Institute and is protected by applicable copyright laws. Unauthorized reproduction is prohibited.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>3. User Submissions</h2>
                    <p style={{ marginBottom: '1rem' }}>By submitting an application through our website, you confirm that all information provided is accurate and that you have the right to share any attached documents.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>4. Limitation of Liability</h2>
                    <p style={{ marginBottom: '1rem' }}>Nexus Genomics Institute is not liable for any damages arising from the use of this website. The site is provided &quot;as is&quot; without warranties of any kind.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>5. Contact</h2>
                    <p style={{ marginBottom: '1rem' }}>For questions regarding these terms, contact: evelyn.vance@nexusgenomics.edu</p>
                </div>
            </div>
        </div>
    );
}
