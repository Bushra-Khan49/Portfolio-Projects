'use client';

/**
 * 🔒 SECURITY MODAL
 * ---------------------------------
 * Provides authentication for the PI Admin Panel.
 * 
 * FEATURES:
 * - Server-side validation: Credentials are sent to /api/auth and validated on the server.
 * - Anti-Brute Force: Server adds artificial delay on failed attempts.
 * - Session Management: Sets 'isAdminAuthenticated' in sessionStorage upon success.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId, password }),
            });

            const data = await res.json();

            if (res.ok && data.authenticated) {
                // Auth cookie is set by the server (httpOnly) — no client-side storage needed
                window.location.href = '/admin';
            } else {
                setError(data.error || 'Invalid credentials.');
                setIsSubmitting(false);
            }
        } catch {
            setError('Network error. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="login-overlay"
                >
                    <div className="login-backdrop" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="login-modal glass-card"
                    >
                        <div className="login-header">
                            <div className="login-icon-bg">
                                <Lock size={24} color="var(--color-primary)" />
                            </div>
                            <h2>Admin Authentication</h2>
                            <p>Restricted access — authorized personnel only</p>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
                            {error && (
                                <motion.div
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                    className="login-error"
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div className="form-group">
                                <label>Admin ID</label>
                                <input
                                    type="text"
                                    value={adminId}
                                    onChange={(e) => setAdminId(e.target.value)}
                                    className={`form-input focus-elevate ${error ? 'input-error' : ''}`}
                                    required
                                    placeholder="Enter Admin ID"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`form-input focus-elevate ${error ? 'input-error' : ''}`}
                                        required
                                        placeholder="••••••••"
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(0,0,0,0.3)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary login-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="spinner" size={20} /> : 'Authenticate'}
                                </button>
                            </div>
                        </form>

                        <button className="login-close" onClick={onClose}>Cancel</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
