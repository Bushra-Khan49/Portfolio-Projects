import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Nexus Genomics Institute',
    description: 'Privacy policy for the Nexus Genomics Institute website.',
};

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)', fontFamily: 'var(--font-sans)' }}>
            <div className="container" style={{ maxWidth: '800px', padding: '6rem 1.5rem 4rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2rem', fontSize: '0.9rem' }}>
                    ← Back to Home
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Privacy Policy</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>Last updated: May 15, 2026</p>

                <div style={{ lineHeight: 1.8, color: 'var(--color-text-main)', fontSize: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>1. Information We Collect</h2>
                    <p style={{ marginBottom: '1rem' }}>When you submit a lab application through our Join form, we collect your name, email address, institutional affiliation, and research interests. We do not use cookies for tracking purposes.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>2. How We Use Your Information</h2>
                    <p style={{ marginBottom: '1rem' }}>Application data is used solely for the purpose of evaluating prospective lab members. Your information is stored securely on our servers and is not shared with third parties.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>3. Data Retention</h2>
                    <p style={{ marginBottom: '1rem' }}>Application data is retained for the duration of the application cycle. You may request deletion of your data at any time by contacting us at the email listed on our website.</p>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>4. Contact</h2>
                    <p style={{ marginBottom: '1rem' }}>For privacy-related inquiries, please contact: evelyn.vance@nexus-genomics.org</p>
                </div>
            </div>
        </div>
    );
}
