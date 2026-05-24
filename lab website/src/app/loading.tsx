/**
 * Homepage loading skeleton — shown by Next.js while the page is loading.
 * Matches the visual structure of the hero section.
 */
export default function Loading() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-white)',
            gap: '1.5rem',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-primary)',
                animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                Loading Nexus Genomics Institute...
            </p>
        </div>
    );
}
