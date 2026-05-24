import React from 'react';
import { 
    LayoutDashboard, 
    FlaskConical, 
    MapPin, 
    Target, 
    Presentation, 
    Users, 
    User, 
    Settings, 
    FileText,
    LogOut,
    ExternalLink,
    Sun,
    Moon
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onSignOut: () => void;
    theme: string;
    toggleTheme: () => void;
}

const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'research', label: 'Research Areas', icon: <FlaskConical size={18} /> },
    { id: 'facilities', label: 'Facilities', icon: <MapPin size={18} /> },
    { id: 'goals', label: 'Lab Goals', icon: <Target size={18} /> },
    { id: 'sessions', label: 'Meetings', icon: <Presentation size={18} /> },
    { id: 'team', label: 'Team Members', icon: <Users size={18} /> },
    { id: 'pi', label: 'PI Profile', icon: <User size={18} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Security', icon: <Settings size={18} /> },
];

/**
 * 📱 ADMIN SIDEBAR
 * ----------------
 * Navigation for the admin dashboard. Uses fixed positioning on desktop.
 */
export const AdminSidebar = ({ activeTab, setActiveTab, onSignOut, theme, toggleTheme }: SidebarProps) => {
    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--color-admin-sidebar, #1b4332)',
            color: 'white',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
        }}>
            {/* Brand */}
            <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '8px' }} />
                    Nexus Admin
                </div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Genomics Institute Panel
                </p>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1 }}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.7)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            marginBottom: '0.5rem',
                            textAlign: 'left'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem 1.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Mode Toggle</span>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid var(--color-accent, #52b788)',
                            backgroundColor: theme === 'light' ? 'rgba(82, 183, 136, 0.15)' : '#2d6a4f',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                        }}
                    >
                        {theme === 'light' ? <Moon size={14} style={{ color: 'var(--color-accent, #52b788)' }} /> : <Sun size={14} />}
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                </div>
                <Link 
                    href="/" 
                    target="_blank"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        marginBottom: '0.5rem'
                    }}
                >
                    <ExternalLink size={16} />
                    View Public Site
                </Link>
                <button
                    onClick={onSignOut}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#f87171',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                    }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
