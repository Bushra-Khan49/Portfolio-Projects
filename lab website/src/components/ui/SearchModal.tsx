'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, FlaskConical, Target, FileText, Presentation, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchResult {
    type: 'research' | 'facility' | 'goal' | 'publication' | 'session';
    title: string;
    excerpt: string;
    link: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    research: <FlaskConical size={16} />,
    facility: <MapPin size={16} />,
    goal: <Target size={16} />,
    publication: <FileText size={16} />,
    session: <Presentation size={16} />,
};

const typeLabels: Record<string, string> = {
    research: 'Research',
    facility: 'Facilities',
    goal: 'Goals',
    publication: 'Publications',
    session: 'Sessions',
};

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounced search against the real API
    useEffect(() => {
        if (!query || query.length < 2) {
            setIsSearching(false);
            setHasSearched(false);
            setResults([]);
            return;
        }

        setIsSearching(true);
        setHasSearched(false);

        const handler = setTimeout(async () => {
            try {
                const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                setResults([]);
            }
            setIsSearching(false);
            setHasSearched(true);
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Group results by type
    const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
        if (!acc[r.type]) acc[r.type] = [];
        acc[r.type].push(r);
        return acc;
    }, {});

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="search-overlay"
                >
                    <div className="search-backdrop" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.95, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="search-modal glass-card"
                    >
                        {/* Input Header */}
                        <div className="search-header">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search research, facilities, goals, publications..."
                                className="search-input"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {isSearching && <Loader2 className="spinner" size={20} />}
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="search-content">

                            {!query && (
                                <div className="search-empty">
                                    <p className="search-heading">Search Tips</p>
                                    <div className="recent-list">
                                        <button className="recent-item" onClick={() => setQuery('genomics')}>genomics</button>
                                        <button className="recent-item" onClick={() => setQuery('protein')}>protein</button>
                                        <button className="recent-item" onClick={() => setQuery('greenhouse')}>greenhouse</button>
                                    </div>
                                </div>
                            )}

                            {isSearching && (
                                <div className="search-loading">
                                    <div className="shimmer-group">
                                        <div className="shimmer-title" />
                                        <div className="shimmer-desc" />
                                    </div>
                                    <div className="shimmer-group">
                                        <div className="shimmer-title" />
                                        <div className="shimmer-desc" />
                                    </div>
                                </div>
                            )}

                            {hasSearched && query && results.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                    <p>No results found for &ldquo;{query}&rdquo;</p>
                                </div>
                            )}

                            {hasSearched && results.length > 0 && (
                                <div className="search-results">
                                    {Object.entries(grouped).map(([type, items]) => (
                                        <div key={type} className="result-group">
                                            <p className="search-heading">{typeLabels[type] || type} ({items.length})</p>
                                            {items.map((item, idx) => (
                                                <Link key={idx} href={item.link} className="result-item" onClick={onClose}>
                                                    <div className="result-icon-wrapper">{typeIcons[item.type]}</div>
                                                    <div className="result-text">
                                                        <span className="result-title">{item.title}</span>
                                                        <span className="result-excerpt">{item.excerpt}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div className="search-footer">
                            <span><kbd>ESC</kbd> to close</span>
                            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                            <span><kbd>↵</kbd> to select</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
