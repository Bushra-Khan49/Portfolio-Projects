'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, FileText, FlaskConical, Presentation, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounce hook simulation for Sanity GROQ execution
    useEffect(() => {
        if (!query) {
            setIsSearching(false);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(false);

        const handler = setTimeout(() => {
            // Simulate API fetch from GROQ endpoint defined in queries.ts
            console.log(`Executing global GROQ search for: ${query}`);
            setIsSearching(false);
            setHasSearched(true);
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    // Command+K listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // Toggle logic would be handled by parent state
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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
                                placeholder="Search publications, projects, or presentations..."
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
                                    <p className="search-heading">Recent Searches</p>
                                    <div className="recent-list">
                                        <button className="recent-item">Mentha silicon pathway</button>
                                        <button className="recent-item">Drought stress proteomics</button>
                                        <button className="recent-item">Abinaya publications 2023</button>
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

                            {hasSearched && query && (
                                <div className="search-results">
                                    {/* Mock logic showing grouped schema responses from GROQ */}
                                    <div className="result-group">
                                        <p className="search-heading">Publications (1)</p>
                                        <a href="#" className="result-item">
                                            <div className="result-icon-wrapper"><FileText size={16} /></div>
                                            <div className="result-text">
                                                <span className="result-title">Mentha arvensis – Vital Herbs with Myriads of Benefits</span>
                                                <span className="result-excerpt">Horticulturae, 2023 | IF: 3.1...</span>
                                            </div>
                                        </a>
                                    </div>

                                    <div className="result-group">
                                        <p className="search-heading">Projects (1)</p>
                                        <a href="#" className="result-item">
                                            <div className="result-icon-wrapper"><FlaskConical size={16} /></div>
                                            <div className="result-text">
                                                <span className="result-title">Complete Mentha genome assembly</span>
                                                <span className="result-excerpt">Status: Ongoing • 75% Completed</span>
                                            </div>
                                        </a>
                                    </div>
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
