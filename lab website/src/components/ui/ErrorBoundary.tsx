'use client';

import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    /** Fallback UI shown when a child component crashes */
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Reusable Error Boundary — catches render errors in child components
 * and shows a friendly fallback instead of crashing the entire page.
 *
 * Usage: <ErrorBoundary><YourComponent /></ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-sans)',
                }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Something went wrong
                    </p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        This section failed to load. Please refresh the page.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            marginTop: '1rem', padding: '0.5rem 1.5rem',
                            borderRadius: '8px', border: '1px solid var(--color-border)',
                            background: 'none', cursor: 'pointer', fontSize: '0.85rem',
                            color: 'var(--color-primary)', fontWeight: 600,
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
