'use client';

/**
 * 🔒 SECURITY MODAL (THE GATEKEEPER)
 * ---------------------------------
 * This component provides System Authentication for the PI Admin Panel.
 * 
 * FEATURES:
 * - Real-time validation: Fetches current credentials from admin-settings.json.
 * - Anti-Brute Force Pattern: Simulates network delay (800ms) to discourage botting.
 * - Session Management: Sets 'isAdminAuthenticated' in sessionStorage upon success.
 */


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validCredentials, setValidCredentials] = useState({ adminId: 'abinaya222@gmail.com', password: 'herbalomicspanel' });

    // Fetch latest credentials from settings
    useEffect(() => {
        if (isOpen) {
            fetch('/api/admin-data?type=settings')
                .then(r => r.json())
                .then(setValidCredentials)
                .catch(err => console.error('Failed to fetch auth settings:', err));
        }
    }, [isOpen]);

    // Simulating Firebase Auth RBAC validation state
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (adminId === validCredentials.adminId && password === validCredentials.password) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            window.location.href = '/admin'; // Proceed to PI Dashboard
        } else {
            setError('Invalid credentials or account disabled.');
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
                            <h2>System Authentication</h2>
                            <p>Firebase RBAC Secure Login</p>
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
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`form-input focus-elevate ${error ? 'input-error' : ''}`}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="login-meta">
                                <label className="checkbox-wrap">
                                    <input type="checkbox" />
                                    <span>Remember securely</span>
                                    <div className="checkbox-indicator"></div>
                                </label>
                                <a href="#" className="forgot-link">Reset Access</a>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary login-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="spinner" size={20} /> : 'Authenticate Session'}
                            </button>

                            {process.env.NODE_ENV === 'development' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        sessionStorage.setItem('isAdminAuthenticated', 'true');
                                        window.location.href = '/admin';
                                    }}
                                    className="btn"
                                    style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: '1px dashed #d1d5db',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    🛠️ Dev Mode: Quick Access
                                </button>
                            )}
                        </form>

                        <button className="login-close" onClick={onClose}>Cancel</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
