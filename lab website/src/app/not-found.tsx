import Link from 'next/link';

/**
 * Custom 404 Page
 * Matches the site's design language with a friendly, branded error message.
 */
export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-white)',
            color: 'var(--color-text-main)',
            fontFamily: 'var(--font-sans)',
            textAlign: 'center',
            padding: '2rem',
        }}>
            <div style={{
                fontSize: '8rem',
                fontWeight: 900,
                lineHeight: 1,
                color: 'var(--color-primary)',
                opacity: 0.15,
                marginBottom: '-1rem',
            }}>
                404
            </div>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: 'var(--color-text-main)',
            }}>
                Page Not Found
            </h1>
            <p style={{
                color: 'var(--color-text-muted)',
                maxWidth: '480px',
                marginBottom: '2rem',
                fontSize: '1.05rem',
                lineHeight: 1.6,
            }}>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back to the research.
            </p>
            <Link
                href="/"
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
                ← Back to Homepage
            </Link>
        </div>
    );
}
