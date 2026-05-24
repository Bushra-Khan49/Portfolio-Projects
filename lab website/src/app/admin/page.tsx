'use client';

/**
 * 🛠️ PI ADMIN DASHBOARD (MAIN ENTRY)
 * ---------------------------------
 * This is the central command center for the Nexus Genomics Institute CMS.
 * 
 * REFACTORED ARCHITECTURE:
 * - Tab-driven state management (activeTab) to switch between CMS modules.
 * - Modular Components: Each tab is extracted into its own file in ./components.
 * - Shared UI: Consistent design language via BaseManagementTab and SharedUI.
 * 
 * SECURITY:
 * - Server-side JWT verification on mount.
 * - Direct URL access is blocked and redirected to the homepage if unauthorized.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

// Components
import { AdminSidebar } from './components/AdminSidebar';
import { OverviewTab } from './components/OverviewTab';
import { SessionsTab } from './components/SessionsTab';
import { TeamTab } from './components/TeamTab';
import { PITab } from './components/PITab';
import { ResearchTab } from './components/ResearchTab';
import { FacilitiesTab } from './components/FacilitiesTab';
import { GoalsTab } from './components/GoalsTab';
import { ApplicationsTab } from './components/ApplicationsTab';
import { SettingsTab } from './components/SettingsTab';
import { AboutTab } from './components/AboutTab';

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [theme, setTheme] = useState('light');

    // Init theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Security Gate: Verify JWT cookie on mount via server-side check
    useEffect(() => {
        async function verifyAuth() {
            try {
                const res = await fetch('/api/v1/auth');
                const data = await res.json();
                if (res.ok && data.authenticated) {
                    setIsAuthorized(true);
                } else {
                    router.push('/');
                }
            } catch {
                router.push('/');
            }
        }
        verifyAuth();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await fetch('/api/v1/auth', { method: 'DELETE' });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        router.push('/');
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    if (isAuthorized === null) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--admin-bg, #f1f8f5)' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={48} className="spinner" style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: 'var(--admin-text-main, #1b4332)', fontWeight: 600 }}>Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-root" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--admin-bg, #f1f8f5)', transition: 'background-color 0.3s ease' }}>
            {/* Notification Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '2rem', right: '2rem', padding: '1rem 1.5rem',
                    borderRadius: '12px', backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', fontSize: '0.95rem', fontWeight: 700, display: 'flex',
                    alignItems: 'center', gap: '0.75rem', zIndex: 10000, 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    animation: 'slide-in 0.3s ease-out'
                }}>
                    {toast.type === 'success' ? <Check size={20} /> : <X size={20} />}
                    {toast.message}
                </div>
            )}

            {/* Navigation Sidebar */}
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onSignOut={handleSignOut} 
                theme={theme}
                toggleTheme={toggleTheme}
            />

            {/* Main Content Area */}
            <main style={{ 
                flexGrow: 1, 
                marginLeft: '280px', // Matches Sidebar width
                padding: '3rem 4rem', 
                minHeight: '100vh',
                maxWidth: '1600px',
                color: 'var(--admin-text-main, #1b4332)'
            }}>
                {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
                {activeTab === 'sessions' && <SessionsTab showToast={showToast} />}
                {activeTab === 'team' && <TeamTab showToast={showToast} />}
                {activeTab === 'pi' && <PITab showToast={showToast} />}
                {activeTab === 'research' && <ResearchTab showToast={showToast} />}
                { activeTab === 'facilities' && <FacilitiesTab showToast={showToast} />}
                { activeTab === 'goals' && <GoalsTab showToast={showToast} />}
                { activeTab === 'about' && <AboutTab showToast={showToast} />}
                { activeTab === 'applications' && <ApplicationsTab showToast={showToast} />}
                {activeTab === 'settings' && <SettingsTab showToast={showToast} />}
            </main>

            <style jsx global>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .fade-in {
                    animation: fade-in 0.4s ease-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
