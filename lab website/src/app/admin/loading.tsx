/** Admin dashboard loading skeleton */
export default function AdminLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-gray)',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-primary)',
                animation: 'spin 1s linear infinite',
            }} />
        </div>
    );
}
