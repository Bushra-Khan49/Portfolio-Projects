import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { AdminCard } from './SharedUI';

interface OverviewTabProps {
    onNavigate: (tab: string) => void;
}

/**
 * 🏠 OVERVIEW TAB
 * ---------------
 * Summary dashboard with stats and quick links.
 */
export const OverviewTab = ({ onNavigate }: OverviewTabProps) => {
    const [stats, setStats] = useState({ 
        team: 0, 
        sessions: 0, 
        apps: 0, 
        research: 0 
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [teamRes, sessRes, appsRes, resRes] = await Promise.all([
                    fetch('/api/admin-data?type=team'),
                    fetch('/api/admin-data?type=sessions'),
                    fetch('/api/applications'),
                    fetch('/api/admin-data?type=research')
                ]);
                
                const [team, sess, apps, research] = await Promise.all([
                    teamRes.json(),
                    sessRes.json(),
                    appsRes.json(),
                    resRes.json()
                ]);
                
                setStats({
                    team: (team.phdScholars?.length || 0) + (team.researchAssociates?.length || 0) + (team.interns?.length || 0) + 1,
                    sessions: sess.presenters?.length || 0,
                    apps: apps.length || 0,
                    research: research.length || 0,
                });
            } catch (err) {
                console.error("Failed to load overview stats:", err);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const statCards = [
        { id: 'team', label: 'Team Members', value: stats.team, icon: <Users size={24} />, color: '#2d6a4f' },
        { id: 'sessions', label: 'Presentations', value: stats.sessions, icon: <CalendarDays size={24} />, color: '#5551ff' },
        { id: 'applications', label: 'Applications', value: stats.apps, icon: <FileText size={24} />, color: '#e85d04' },
        { id: 'research', label: 'Research Areas', value: stats.research, icon: <BookOpen size={24} />, color: '#9b2226' },
    ];

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                    Dashboard Overview
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                    Welcome back. Here is a real-time snapshot of the Nexus Genomics Institute portal.
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map(c => (
                    <div 
                        key={c.id} 
                        onClick={() => onNavigate(c.id)}
                        style={{
                            backgroundColor: 'var(--admin-card-bg, #ffffff)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid var(--admin-border)',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = c.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--admin-border)';
                        }}
                    >
                        <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            backgroundColor: 'transparent', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: c.color,
                            marginBottom: '1.25rem'
                        }}>
                            {c.icon}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--admin-title-color)', lineHeight: 1 }}>
                            {isLoading ? '...' : c.value}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--admin-title-color)', marginTop: '0.5rem', fontWeight: 700 }}>
                            {c.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <AdminCard title="Quick Management" subtitle="Jump directly to frequent administrative tasks.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        { label: 'Schedule Meeting', tab: 'sessions' },
                        { label: 'Add Team Member', tab: 'team' },
                        { label: 'Review Applications', tab: 'applications' },
                        { label: 'Security Settings', tab: 'settings' }
                    ].map(action => (
                        <button
                            key={action.label}
                            onClick={() => onNavigate(action.tab)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: '1px solid var(--admin-border)',
                                backgroundColor: 'var(--admin-bg, #ffffff)',
                                color: 'var(--color-text-main)',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--admin-card-bg, white)';
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.color = 'var(--color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--admin-bg, #ffffff)';
                                e.currentTarget.style.borderColor = 'var(--admin-border)';
                                e.currentTarget.style.color = 'var(--color-text-main)';
                            }}
                        >
                            {action.label}
                            <ArrowRight size={16} />
                        </button>
                    ))}
                </div>
            </AdminCard>
        </div>
    );
};
