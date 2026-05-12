'use client';

/**
 * 🛠️ PI ADMIN DASHBOARD (MAIN ENTRY)
 * ---------------------------------
 * This is the central command center for the Herbal Omics Lab CMS.
 * 
 * DESIGN PATTERN:
 * - Single Page Application (SPA) inside a Next.js route.
 * - Tab-driven state management (activeTab) to switch between CMS modules.
 * - Reactive data fetching: Each tab component (TeamTab, PITab, etc.) 
 *   manages its own fetch/save cycle to ensure clean data isolation.
 * 
 * SECURITY:
 * - Implements a sessionStorage 'isAuthorized' gate on mount.
 * - Direct URL access is blocked and redirected to the homepage.
 */


import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, FlaskConical, Target, CalendarDays, Users, LogOut,
    Plus, Edit2, Trash2, Upload, ImageIcon, X, Check, Loader2,
    Save, GripVertical, Clock, MapPin, Hash, FileText, Download,
    ChevronRight, UserCheck, BookOpen, Beaker, Eye, History, AlertCircle, Link2, Settings
} from 'lucide-react';
import { researchData, facilitiesData, goalsData } from '@/data/mockData';
import Image from 'next/image';
import ImageCropModal from '@/components/ui/ImageCropModal';
import ImagePreview from '@/components/admin/ImagePreview';

// ═══════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════

interface MeetingData {
    title: string;
    number: string;
    purpose: string;
    date: string;
    time: string;
    location: string;
}

interface Presenter {
    id: string;
    presenter: string;
    topic: string;
    time: string;
    status: string;
}

interface HistoryEntry {
    id: string;
    title: string;
    number: string;
    date: string;
    time: string;
    location: string;
    purpose: string;
    presenters: Presenter[];
    archivedAt: string;
}

interface SessionsData {
    meeting: MeetingData;
    presenters: Presenter[];
    history: HistoryEntry[];
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
}

interface TeamData {
    phdScholars: TeamMember[];
    researchAssociates: TeamMember[];
    interns: TeamMember[];
}

interface Publication {
    id: string;
    title: string;
    link: string;
}

interface PIData {
    name: string;
    role: string;
    affiliation: string;
    email: string;
    altEmail: string;
    location: string;
    quote: string;
    featuredPublication: string;
    publications: Publication[];
}

interface Application {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    country: string;
    institute: string;
    position: string;
    period: string;
    joinDate: string;
    endDate: string;
    topic: string;
    resumePath?: string;
    resumeFilename?: string;
    submittedAt: string;
    status: string;
}

// ═══════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Security Gate: Check for session on mount
    useEffect(() => {
        const isDev = process.env.NODE_ENV === 'development';
        const auth = sessionStorage.getItem('isAdminAuthenticated');

        // Allow access if authenticated OR if in development mode for easier debugging
        if (auth === 'true' || isDev) {
            setIsAuthorized(true);
        } else {
            router.push('/');
        }
    }, [router]);

    function handleSignOut() {
        sessionStorage.removeItem('isAdminAuthenticated');
        router.push('/');
    }

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    if (isAuthorized === null) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-gray)' }}>
                <Loader2 size={40} className="spinner" style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-gray)' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', padding: '1rem 1.5rem',
                    borderRadius: '8px', backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626',
                    color: 'white', fontSize: '0.9rem', fontWeight: 600, display: 'flex',
                    alignItems: 'center', gap: '0.5rem', zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}>
                    {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Sidebar */}
            <aside style={{ width: '280px', backgroundColor: 'var(--color-bg-white)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>Herbal Omics Lab</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Admin Portal</p>
                </div>
                <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                    {[
                        { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
                        { id: 'sessions', icon: <CalendarDays size={20} />, label: 'Manage Sessions' },
                        { id: 'team', icon: <Users size={20} />, label: 'Manage Team' },
                        { id: 'pi', icon: <UserCheck size={20} />, label: 'PI Profile' },
                        { id: 'research', icon: <FlaskConical size={20} />, label: 'Research Areas' },
                        { id: 'facilities', icon: <Beaker size={20} />, label: 'Facilities' },
                        { id: 'goals', icon: <Target size={20} />, label: 'Goals' },
                        { id: 'applications', icon: <FileText size={20} />, label: 'Lab Applications' },
                        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={getTabStyle(activeTab === tab.id)}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>A</div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Dr. Abinaya</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PI / Admin</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        style={{ ...getTabStyle(false), color: '#ef4444' }}
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flexGrow: 1, padding: '3rem 4rem', overflowY: 'auto', maxHeight: '100vh' }}>
                {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
                {activeTab === 'sessions' && <SessionsTab showToast={showToast} />}
                {activeTab === 'team' && <TeamTab showToast={showToast} />}
                {activeTab === 'pi' && <PITab showToast={showToast} />}
                {activeTab === 'research' && <ResearchTab showToast={showToast} />}
                {activeTab === 'facilities' && <FacilitiesTab showToast={showToast} />}
                {activeTab === 'goals' && <GoalsTab showToast={showToast} />}
                {activeTab === 'applications' && <ApplicationsTab showToast={showToast} />}
                {activeTab === 'settings' && <SettingsTab showToast={showToast} />}
            </main>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  OVERVIEW TAB
// ═══════════════════════════════════════════════════════

function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const [stats, setStats] = useState({ team: 0, sessions: 0, apps: 0, research: researchData.length });

    useEffect(() => {
        async function load() {
            try {
                const [teamRes, sessRes, appsRes, resRes] = await Promise.all([
                    fetch('/api/admin-data?type=team'),
                    fetch('/api/admin-data?type=sessions'),
                    fetch('/api/applications'),
                    fetch('/api/admin-data?type=research')
                ]);
                const team: TeamData = await teamRes.json();
                const sess: SessionsData = await sessRes.json();
                const apps: Application[] = await appsRes.json();
                const research = await resRes.json();
                
                setStats({
                    team: (team.phdScholars?.length || 0) + (team.researchAssociates?.length || 0) + (team.interns?.length || 0) + 1,
                    sessions: sess.presenters?.length || 0,
                    apps: apps.length,
                    research: research.length || 0,
                });
            } catch { /* ignore */ }
        }
        load();
    }, []);

    const cards = [
        { label: 'Team Members', value: stats.team, icon: <Users size={28} />, color: '#2d6a4f' },
        { label: 'Upcoming Presentations', value: stats.sessions, icon: <CalendarDays size={28} />, color: '#5551ff' },
        { label: 'Lab Applications', value: stats.apps, icon: <FileText size={28} />, color: '#e85d04' },
        { label: 'Research Areas', value: stats.research, icon: <BookOpen size={28} />, color: '#9b2226' },
    ];

    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Welcome back, Dr. Abinaya. Here&apos;s a snapshot of your lab.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {cards.map(c => (
                    <div key={c.label} style={{
                        backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '2rem',
                        border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
                        </div>
                        <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1 }}>{c.value}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>{c.label}</p>
                    </div>
                ))}
            </div>
            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        { label: 'Manage Sessions', tab: 'sessions', icon: <CalendarDays size={16} /> },
                        { label: 'Manage Team', tab: 'team', icon: <Users size={16} /> },
                        { label: 'Research Areas', tab: 'research', icon: <FlaskConical size={16} /> },
                        { label: 'Facilities', tab: 'facilities', icon: <Beaker size={16} /> },
                        { label: 'Goals', tab: 'goals', icon: <Target size={16} /> },
                        { label: 'View Applications', tab: 'applications', icon: <FileText size={16} /> },
                        { label: 'PI Profile', tab: 'pi', icon: <UserCheck size={16} /> },
                    ].map(a => (
                        <div key={a.tab} onClick={() => onNavigate(a.tab)} className="quick-action-btn"
                            style={{
                                padding: '1rem', borderRadius: '10px',
                                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-white)',
                                color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                transition: 'all 0.2s ease-in-out',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(85,81,255,0.1)';
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.backgroundColor = 'rgba(85,81,255,0.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-white)';
                            }}>
                            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(85,81,255,0.08)' }}>{a.icon}</div>
                            <span style={{ flexGrow: 1 }}>{a.label}</span>
                            <ChevronRight size={14} opacity={0.5} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  SESSIONS TAB
// ═══════════════════════════════════════════════════════

function SessionsTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<SessionsData | null>(null);
    const [saving, setSaving] = useState(false);
    const [editingPresenter, setEditingPresenter] = useState<string | null>(null);
    const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
    const [previewCSV, setPreviewCSV] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/admin-data?type=sessions').then(r => r.json()).then(setData);
    }, []);

    // Memoized flat CSV data for preview/export
    const flatHistoryData = useMemo(() => {
        if (!data || !data.history) return [];
        return data.history.flatMap(h => 
            h.presenters.length > 0 ? h.presenters.map(p => ({ ...p, h })) : [{ presenter: 'No presenters', topic: '-', time: '-', status: '-', h }]
        );
    }, [data?.history]);

    async function save(updated: SessionsData) {
        setSaving(true);
        try {
            await fetch('/api/admin-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'sessions', data: updated }) });
            setData(updated);
            showToast('Sessions saved!', 'success');
        } catch { showToast('Failed to save', 'error'); }
        setSaving(false);
    }

    function updateMeeting(field: string, value: string) {
        if (!data) return;
        const updated = { ...data, meeting: { ...data.meeting, [field]: value } };
        setData(updated);
    }

    function addPresenter() {
        if (!data) return;
        const newP: Presenter = { id: Date.now().toString(), presenter: '', topic: '', time: '', status: 'scheduled' };
        const updated = { ...data, presenters: [...data.presenters, newP] };
        setData(updated);
        setEditingPresenter(newP.id);
    }

    function updatePresenter(id: string, field: string, value: string) {
        if (!data) return;
        const updated = { ...data, presenters: data.presenters.map(p => p.id === id ? { ...p, [field]: value } : p) };
        setData(updated);
    }

    function deletePresenter(id: string) {
        if (!data) return;
        const updated = { ...data, presenters: data.presenters.filter(p => p.id !== id) };
        setData(updated);
    }

    function downloadHistory() {
        if (!data || !data.history || data.history.length === 0) {
            showToast('No history to export', 'error');
            return;
        }

        const headers = ['Meeting Date', 'Meeting Title', 'Meeting Number', 'Presenter', 'Topic', 'Time', 'Status', 'Purpose', 'Location', 'Archived At'];
        const rows = data.history.flatMap(h => 
            h.presenters.length > 0 ? h.presenters.map(p => [
                h.date, h.title, h.number, p.presenter, p.topic, p.time, p.status, h.purpose.replace(/\n/g, ' '), h.location, h.archivedAt
            ]) : [[h.date, h.title, h.number, 'No presenters', '-', '-', '-', h.purpose.replace(/\n/g, ' '), h.location, h.archivedAt]]
        );

        const csvContent = [headers, ...rows].map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Lab_Meeting_History_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (!data) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    const tableHeaderStyle: React.CSSProperties = {
        textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '2px solid var(--color-border)',
        fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'
    };
    const tableCellStyle: React.CSSProperties = {
        padding: '1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem', color: 'var(--color-text-main)'
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Manage Sessions</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Configure lab meetings and track researcher presentations.</p>
                </div>
                <button onClick={() => save(data)} disabled={saving} className="btn btn-primary" style={{ gap: '0.5rem', opacity: saving ? 0.6 : 1 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />} Save All Changes
                </button>
            </div>

            {/* Meeting Details + Countdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LayoutDashboard size={20} className="text-primary" /> Current Session Setup
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Meeting Title</label>
                            <input style={inputStyle} value={data.meeting.title} onChange={e => updateMeeting('title', e.target.value)} placeholder="e.g. Weekly Progress Review" />
                        </div>
                        <div>
                            <label style={labelStyle}><Hash size={14} /> Meeting Number</label>
                            <input style={inputStyle} value={data.meeting.number} onChange={e => updateMeeting('number', e.target.value)} placeholder="e.g. 15th" />
                        </div>
                        <div>
                            <label style={labelStyle}><MapPin size={14} /> Location</label>
                            <input style={inputStyle} value={data.meeting.location} onChange={e => updateMeeting('location', e.target.value)} placeholder="e.g. Room 38, SCIS" />
                        </div>
                        <div>
                            <label style={labelStyle}><CalendarDays size={14} /> Date</label>
                            <input type="date" style={inputStyle} value={data.meeting.date} onChange={e => updateMeeting('date', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}><Clock size={14} /> Time</label>
                            <input type="time" style={inputStyle} value={data.meeting.time} onChange={e => updateMeeting('time', e.target.value)} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Meeting Purpose & Agenda</label>
                            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={data.meeting.purpose} onChange={e => updateMeeting('purpose', e.target.value)} placeholder="Briefly describe the focus of this session..." />
                        </div>
                    </div>
                </div>

                {data.meeting && (
                    <CountdownCard 
                        date={data.meeting.date} 
                        time={data.meeting.time} 
                        title={data.meeting.title} 
                        number={data.meeting.number} 
                        location={data.meeting.location} 
                    />
                )}
            </div>

            {/* Presenters Table */}
            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-border)', marginBottom: '3rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Presenters for this Session</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Detailed list of research presentations scheduled.</p>
                    </div>
                    <button onClick={addPresenter} style={{ ...btnSmall, backgroundColor: 'rgba(85,81,255,0.1)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.6rem 1.25rem', borderRadius: '8px' }}>
                        <Plus size={16} /> Add Presenter to Session
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '50px' }}>#</th>
                                <th style={tableHeaderStyle}>Presenter Name</th>
                                <th style={tableHeaderStyle}>Research Topic</th>
                                <th style={tableHeaderStyle}>Time Slot</th>
                                <th style={tableHeaderStyle}>Current Status</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.presenters.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No presenters added to this session yet.</td>
                                </tr>
                            ) : (
                                data.presenters.map((p, idx) => (
                                    <tr key={p.id}>
                                        <td style={tableCellStyle}><span style={{ fontWeight: 700, opacity: 0.5 }}>{idx + 1}</span></td>
                                        <td style={tableCellStyle}>
                                            {editingPresenter === p.id ? (
                                                <input style={inputStyle} value={p.presenter} onChange={e => updatePresenter(p.id, 'presenter', e.target.value)} />
                                            ) : (
                                                <span style={{ fontWeight: 600 }}>{p.presenter || 'Click Edit to name'}</span>
                                            )}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {editingPresenter === p.id ? (
                                                <input style={inputStyle} value={p.topic} onChange={e => updatePresenter(p.id, 'topic', e.target.value)} />
                                            ) : (
                                                <span style={{ fontSize: '0.85rem' }}>{p.topic || 'No topic assigned'}</span>
                                            )}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {editingPresenter === p.id ? (
                                                <input style={inputStyle} value={p.time} onChange={e => updatePresenter(p.id, 'time', e.target.value)} />
                                            ) : (
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem' }}>{p.time || '—'}</span>
                                            )}
                                        </td>
                                        <td style={tableCellStyle}>
                                            <select value={p.status} onChange={e => updatePresenter(p.id, 'status', e.target.value)} style={{
                                                padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                                                border: '1px solid var(--color-border)', background: '#f8fafc', color: 'var(--color-text-main)'
                                            }}>
                                                {['scheduled', 'completed', 'cancelled', 'rescheduled', 'delayed', 'postponed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditingPresenter(editingPresenter === p.id ? null : p.id)} style={{ ...btnIcon, color: 'var(--color-primary)' }}>
                                                    {editingPresenter === p.id ? <Check size={18} /> : <Edit2 size={18} />}
                                                </button>
                                                <button onClick={() => deletePresenter(p.id)} style={{ ...btnIcon, color: '#ef4444' }}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Archive & Global History */}
            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '16px', padding: '2.5rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <History size={22} className="text-primary" /> Session Record History
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Full spreadsheet-style record of all past meetings.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setPreviewCSV(true)} style={{ ...btnSmall, color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', padding: '0.6rem 1.25rem' }}>
                            <Eye size={18} /> Quick View
                        </button>
                        <button onClick={downloadHistory} style={{ ...btnSmall, color: '#059669', border: '1px solid #10b981', backgroundColor: '#ecfdf5', padding: '0.6rem 1.25rem' }}>
                            <Download size={18} /> Export as CSV (Excel)
                        </button>
                        <button onClick={() => {
                            if (!data) return;
                            if (window.confirm('Archive current session and clear workspace?')) {
                                const entry: HistoryEntry = {
                                    id: Date.now().toString(), ...data.meeting,
                                    presenters: data.presenters, archivedAt: new Date().toISOString(),
                                };
                                const updated: SessionsData = {
                                    meeting: { title: '', number: '', purpose: '', date: '', time: '', location: data.meeting.location },
                                    presenters: [],
                                    history: [entry, ...(data.history || [])],
                                };
                                save(updated);
                            }
                        }} style={{ ...btnSmall, backgroundColor: '#f5f3ff', color: '#7c3aed', border: '1px solid #a78bfa', padding: '0.6rem 1.25rem' }}>
                            <History size={18} /> Archive Session
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={tableHeaderStyle}>Meeting info</th>
                                <th style={tableHeaderStyle}>Stats</th>
                                <th style={tableHeaderStyle}>Presenters & Topics</th>
                                <th style={tableHeaderStyle}>Date Recorded</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!data.history || data.history.length === 0) ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        <AlertCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                        No archived meetings found in the database.
                                    </td>
                                </tr>
                            ) : (
                                data.history.map(h => (
                                    <tr key={h.id} style={{ transition: 'background 0.2s' }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ fontWeight: 700 }}>{h.number} Meeting</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>{h.title}</div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                                {h.presenters.length} People
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                {(expandedHistoryId === h.id ? h.presenters : h.presenters.slice(0, 3)).map(p => (
                                                    <div key={p.id} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 600, color: '#334155' }}>{p.presenter}</span>
                                                        <span style={{ color: '#94a3b8' }}>—</span>
                                                        <span style={{ color: '#64748b', fontStyle: 'italic' }}>{p.topic}</span>
                                                    </div>
                                                ))}
                                                {h.presenters.length > 3 && (
                                                    <button 
                                                        onClick={() => setExpandedHistoryId(expandedHistoryId === h.id ? null : h.id)} 
                                                        style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.2rem' }}
                                                    >
                                                        {expandedHistoryId === h.id ? 'Show Less' : `+ ${h.presenters.length - 3} more presenters...`}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ fontWeight: 600 }}>{h.date}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Archived {new Date(h.archivedAt).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <button 
                                                onClick={() => { if (window.confirm('Permanently delete this archive?')) { setData({ ...data, history: data.history.filter(x => x.id !== h.id) }); } }} 
                                                style={{ ...btnIcon, color: '#ef4444', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '8px' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CSV Quick View Modal */}
            {previewCSV && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '95%', maxWidth: '1200px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={20} className="text-primary" /> Excel Export Preview
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Raw data layout as it will appear in the CSV export.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={downloadHistory} style={{ ...btnSmall, color: 'white', backgroundColor: '#059669', border: 'none' }}><Download size={16} /> Download CSV</button>
                                <button onClick={() => setPreviewCSV(false)} style={{ ...btnSmall, color: '#ef4444', border: '1px solid #fca5a5' }}><X size={16} /> Close</button>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead style={{ position: 'sticky', top: 0, background: '#f1f5f9', zIndex: 10 }}>
                                    <tr>
                                        {['Date', 'Title', 'No.', 'Presenter', 'Topic', 'Time', 'Status'].map(h => (
                                            <th key={h} style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid #e2e8f0', fontWeight: 700, color: '#475569' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {flatHistoryData.map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.6rem 0.75rem' }}>{row.h.date}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{row.h.title}</td>
                                            <td style={{ padding: '0.6rem 0.75rem' }}>{row.h.number}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>{row.presenter}</td>
                                            <td style={{ padding: '0.6rem 0.75rem', fontStyle: 'italic' }}>{row.topic}</td>
                                            <td style={{ padding: '0.6rem 0.75rem' }}>{row.time}</td>
                                            <td style={{ padding: '0.6rem 0.75rem' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: '#f1f5f9', fontWeight: 700 }}>{row.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  TEAM TAB
// ═══════════════════════════════════════════════════════

function TeamTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<TeamData | null>(null);
    const [teamImages, setTeamImages] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; memberKey: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=team').then(r => r.json()).then(setData);
        fetch('/api/team-images').then(r => r.json()).then(setTeamImages);
    }, []);

    async function save(updated: TeamData) {
        setSaving(true);
        try {
            await fetch('/api/admin-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'team', data: updated }) });
            setData(updated);
            showToast('Team saved!', 'success');
        } catch { showToast('Failed to save', 'error'); }
        setSaving(false);
    }

    // Opens the crop modal when a file is selected
    function handleFileSelected(memberKey: string, file: File) {
        setCropTarget({ file, memberKey });
    }

    // Called by the crop modal with the final cropped Blob
    async function handleImageUpload(blob: Blob, memberKey: string) {
        setUploading(memberKey);
        try {
            const ext = blob.type === 'image/png' ? '.png' : '.jpg';
            const fd = new FormData();
            fd.append('memberKey', memberKey);
            fd.append('file', new File([blob], `${memberKey}${ext}`, { type: blob.type }));
            const res = await fetch('/api/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            setTeamImages(prev => ({ ...prev, [memberKey]: `${r.path}?t=${Date.now()}` }));
            showToast('Image uploaded!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        setUploading(null);
    }

    async function handleImageDelete(memberKey: string) {
        try {
            await fetch('/api/team-images', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberKey }) });
            setTeamImages(prev => { const next = { ...prev }; delete next[memberKey]; return next; });
            showToast('Image deleted!', 'success');
        } catch { showToast('Delete failed', 'error'); }
    }

    function getMemberKey(category: string, name: string) {
        const prefix = category === 'phdScholars' ? 'phd' : category === 'researchAssociates' ? 'ra' : 'intern';
        return `${prefix}-${name.toLowerCase().replace(/\s+/g, '-')}`;
    }

    function addMember(category: keyof TeamData) {
        if (!data) return;
        const roleMap = { phdScholars: 'PhD Scholar', researchAssociates: 'Research Associate', interns: 'Intern' };
        const newM: TeamMember = { id: Date.now().toString(), name: '', role: roleMap[category] };
        const updated = { ...data, [category]: [...data[category], newM] };
        setData(updated);
        setEditingId(newM.id);
    }

    function updateMember(category: keyof TeamData, id: string, field: string, value: string) {
        if (!data) return;
        const updated = { ...data, [category]: data[category].map(m => m.id === id ? { ...m, [field]: value } : m) };
        setData(updated);
    }

    function deleteMember(category: keyof TeamData, id: string) {
        if (!data) return;
        const updated = { ...data, [category]: data[category].filter(m => m.id !== id) };
        setData(updated);
    }

    if (!data) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    const categories: { key: keyof TeamData; label: string }[] = [
        { key: 'phdScholars', label: 'PhD Scholars' },
        { key: 'researchAssociates', label: 'Research Associates' },
        { key: 'interns', label: 'Interns' },
    ];

    return (
        <div>
            {/* Image Crop Modal */}
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.memberKey}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)' }}>Manage Team</h1>
                <button onClick={() => save(data)} disabled={saving} className="btn btn-primary" style={{ gap: '0.5rem', opacity: saving ? 0.6 : 1 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />} Save All Changes
                </button>
            </div>

            {/* PI Image Cards */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ ...sectionHeader }}>Principal Investigator — Images</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {[{ key: 'pi-detail', label: 'PI Profile Card (detail section)' }, { key: 'pi-tree', label: 'Team Tree Card (Meet Our Team)' }].map(slot => (
                        <ImageCard key={slot.key} memberKey={slot.key} label={slot.label} imagePath={teamImages[slot.key]} uploading={uploading === slot.key}
                            onUpload={f => handleFileSelected(slot.key, f)} onDelete={() => handleImageDelete(slot.key)} />
                    ))}
                </div>
            </div>

            {categories.map(cat => (
                <div key={cat.key} style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={sectionHeader}>{cat.label} ({data[cat.key].length})</h3>
                        <button onClick={() => addMember(cat.key)} style={{ ...btnSmall, backgroundColor: 'rgba(85,81,255,0.08)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
                            <Plus size={14} /> Add {cat.label.replace(/s$/, '')}
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {data[cat.key].map(member => {
                            const imgKey = getMemberKey(cat.key, member.name);
                            return (
                                <div key={member.id} style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <ImageCircle src={teamImages[imgKey]} size={100} />
                                    {editingId === member.id ? (
                                        <div style={{ width: '100%', marginTop: '1rem' }}>
                                            <input style={{ ...inputStyle, textAlign: 'center', marginBottom: '0.5rem' }} placeholder="Name" value={member.name} onChange={e => updateMember(cat.key, member.id, 'name', e.target.value)} />
                                            <input style={{ ...inputStyle, textAlign: 'center' }} placeholder="Role" value={member.role} onChange={e => updateMember(cat.key, member.id, 'role', e.target.value)} />
                                        </div>
                                    ) : (
                                        <>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '1rem' }}>{member.name || '(unnamed)'}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{member.role}</p>
                                        </>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', width: '100%' }}>
                                        <FileUploadButton label={teamImages[imgKey] ? 'Replace' : 'Photo'} onFile={f => handleFileSelected(imgKey, f)} uploading={uploading === imgKey} />
                                        <button onClick={() => setEditingId(editingId === member.id ? null : member.id)} style={{ ...btnSmall, flex: 1, color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'rgba(85,81,255,0.05)' }}>
                                            <Edit2 size={13} /> Edit
                                        </button>
                                        <button onClick={() => deleteMember(cat.key, member.id)} style={{ ...btnSmall, color: '#ef4444', border: '1px solid #fca5a5', backgroundColor: 'rgba(239,68,68,0.05)' }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  PI PROFILE TAB
// ═══════════════════════════════════════════════════════

function PITab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<PIData | null>(null);
    const [saving, setSaving] = useState(false);
    const [teamImages, setTeamImages] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; memberKey: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=pi').then(r => r.json()).then(setData);
        fetch('/api/team-images').then(r => r.json()).then(setTeamImages);
    }, []);

    async function save() {
        if (!data) return;
        setSaving(true);
        try {
            await fetch('/api/admin-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'pi', data }) });
            showToast('PI profile saved!', 'success');
        } catch { showToast('Save failed', 'error'); }
        setSaving(false);
    }

    // Opens the crop modal when a file is selected
    function handleFileSelected(key: string, file: File) {
        setCropTarget({ file, memberKey: key });
    }

    // Called by the crop modal with the final cropped Blob
    async function handleImageUpload(blob: Blob, memberKey: string) {
        setUploading(memberKey);
        try {
            const ext = blob.type === 'image/png' ? '.png' : '.jpg';
            const fd = new FormData();
            fd.append('memberKey', memberKey);
            fd.append('file', new File([blob], `${memberKey}${ext}`, { type: blob.type }));
            const res = await fetch('/api/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            setTeamImages(prev => ({ ...prev, [memberKey]: `${r.path}?t=${Date.now()}` }));
            showToast('Image uploaded!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        setUploading(null);
    }

    async function handleImageDelete(key: string) {
        try {
            await fetch('/api/team-images', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberKey: key }) });
            setTeamImages(prev => { const n = { ...prev }; delete n[key]; return n; });
            showToast('Image deleted!', 'success');
        } catch { showToast('Delete failed', 'error'); }
    }

    if (!data) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>;

    const fields: { key: keyof PIData; label: string; multiline?: boolean }[] = [
        { key: 'name', label: 'Full Name' },
        { key: 'role', label: 'Designation' },
        { key: 'affiliation', label: 'Affiliation', multiline: true },
        { key: 'email', label: 'Primary Email' },
        { key: 'altEmail', label: 'Alternate Email' },
        { key: 'location', label: 'Office Location' },
        { key: 'quote', label: 'Quote', multiline: true },
    ];

    return (
        <div>
            {/* Image Crop Modal */}
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.memberKey}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)' }}>PI Profile</h1>
                <button onClick={save} disabled={saving} className="btn btn-primary" style={{ gap: '0.5rem', opacity: saving ? 0.6 : 1 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />} Save Changes
                </button>
            </div>

            {/* Image uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {[{ key: 'pi-detail', label: 'Profile Card Image' }, { key: 'pi-tree', label: 'Team Tree Image' }].map(slot => (
                    <ImageCard key={slot.key} memberKey={slot.key} label={slot.label} imagePath={teamImages[slot.key]} uploading={uploading === slot.key}
                        onUpload={f => handleFileSelected(slot.key, f)} onDelete={() => handleImageDelete(slot.key)} />
                ))}
            </div>

            {/* Editable fields */}
            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {fields.map(f => (
                        <div key={f.key} style={f.multiline ? { gridColumn: '1 / -1' } : {}}>
                            <label style={labelStyle}>{f.label}</label>
                            {f.multiline ? (
                                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={data[f.key] as string} onChange={e => setData({ ...data, [f.key]: e.target.value })} />
                            ) : (
                                <input style={inputStyle} value={data[f.key] as string} onChange={e => setData({ ...data, [f.key]: e.target.value })} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Publications */}
            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--color-border)', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}><Link2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />Publications ({(data.publications || []).length})</h3>
                    <button onClick={() => {
                        const pubs = data.publications || [];
                        setData({ ...data, publications: [...pubs, { id: Date.now().toString(), title: '', link: '' }] });
                    }} style={{ ...btnSmall, backgroundColor: 'rgba(85,81,255,0.08)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
                        <Plus size={14} /> Add Publication
                    </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Add publication titles with their URLs. These will appear as clickable hyperlinks on the main page.</p>
                {(data.publications || []).length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No publications added yet. Click &quot;Add Publication&quot; to add one.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(data.publications || []).map((pub, idx) => (
                            <div key={pub.id} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#fafafa' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Publication</span>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <button onClick={() => {
                                            setData({ ...data, publications: data.publications.filter(p => p.id !== pub.id) });
                                        }} style={{ ...btnIcon, color: '#ef4444' }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <div>
                                        <label style={labelStyle}>Paper Title</label>
                                        <input style={inputStyle} placeholder='e.g. Mentha arvensis and Mentha x piperita – Vital Herbs...' value={pub.title} onChange={e => {
                                            const pubs = [...data.publications];
                                            pubs[idx] = { ...pubs[idx], title: e.target.value };
                                            setData({ ...data, publications: pubs });
                                        }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Link2 size={12} /> Paper URL</label>
                                        <input style={inputStyle} placeholder='https://doi.org/10.xxxx/xxxxx or full URL to the paper' value={pub.link} onChange={e => {
                                            const pubs = [...data.publications];
                                            pubs[idx] = { ...pubs[idx], link: e.target.value };
                                            setData({ ...data, publications: pubs });
                                        }} />
                                    </div>
                                </div>
                                {pub.link && (
                                    <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                                        <Eye size={12} /> Preview Link
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  APPLICATIONS TAB
// ═══════════════════════════════════════════════════════

function ApplicationsTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingDoc, setViewingDoc] = useState<{ path: string; name: string } | null>(null);

    useEffect(() => {
        fetch('/api/applications').then(r => r.json()).then(d => { setApps(d); setLoading(false); });
    }, []);

    async function updateStatus(id: string, status: string) {
        try {
            await fetch('/api/applications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
            setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            showToast(`Status updated to ${status}`, 'success');
        } catch { showToast('Failed to update status', 'error'); }
    }

    async function deleteApp(id: string) {
        try {
            await fetch('/api/applications', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            setApps(prev => prev.filter(a => a.id !== id));
            showToast('Application deleted', 'success');
        } catch { showToast('Failed to delete', 'error'); }
    }

    const statusColors: Record<string, string> = { pending: '#e85d04', reviewed: '#5551ff', accepted: '#059669', rejected: '#dc2626' };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Lab Applications</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Review and manage applicant submissions from the Join the Lab form.</p>

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading applications...</div>
            ) : apps.length === 0 ? (
                <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    No applications submitted yet. Applications will appear here when candidates submit the Join the Lab form.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {apps.map(app => (
                        <div key={app.id} style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '1.5rem 2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{app.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{app.email} • Submitted {new Date(app.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)} style={{
                                        padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                                        border: `1px solid ${statusColors[app.status] || '#ccc'}`, color: statusColors[app.status] || '#333',
                                        backgroundColor: `${statusColors[app.status]}10`, cursor: 'pointer',
                                    }}>
                                        {['pending', 'reviewed', 'accepted', 'rejected'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                    <button onClick={() => deleteApp(app.id)} style={{ ...btnIcon, color: '#ef4444' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                                <InfoCell label="City" value={app.city} />
                                <InfoCell label="State" value={app.state} />
                                <InfoCell label="Country" value={app.country} />
                                <InfoCell label="Institute" value={app.institute} />
                                <InfoCell label="Position" value={app.position} />
                                <InfoCell label="Work Period" value={app.period} />
                                <InfoCell label="Join Date" value={app.joinDate} />
                                <InfoCell label="End Date" value={app.endDate} />
                            </div>
                            {app.topic && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Research Topic</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>{app.topic}</p>
                                </div>
                            )}
                            {app.resumePath && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                    <button onClick={() => setViewingDoc({ path: app.resumePath!, name: app.resumeFilename || 'Document' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(5,150,105,0.07)', color: '#059669', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #a7f3d0', cursor: 'pointer' }}>
                                        <Eye size={14} /> Quick View
                                    </button>
                                    <a href={app.resumePath} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(85,81,255,0.07)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                                        <Download size={14} /> {app.resumeFilename || 'Download'}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Document Quick View Modal */}
            {viewingDoc && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setViewingDoc(null)}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}><Eye size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />{viewingDoc.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a href={viewingDoc.path} target="_blank" rel="noopener noreferrer" style={{ ...btnSmall, color: 'var(--color-primary)', border: '1px solid var(--color-primary)', textDecoration: 'none' }}><Download size={13} /> Download</a>
                                <button onClick={() => setViewingDoc(null)} style={{ ...btnSmall, color: '#ef4444', border: '1px solid #fca5a5' }}><X size={13} /> Close</button>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            {viewingDoc.path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#f8fafc' }}>
                                    <img src={viewingDoc.path} alt={viewingDoc.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                            ) : (
                                <iframe src={viewingDoc.path} style={{ width: '100%', height: '100%', border: 'none' }} title="Document Preview" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoCell({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{value || '—'}</p>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  RESEARCH TAB
// ═══════════════════════════════════════════════════════

function ResearchTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; id: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=research').then(r => r.json()).then(d => { setData(d); setLoading(false); });
    }, []);

    async function save() {
        try {
            await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'research', data })
            });
            showToast('Research areas saved successfully', 'success');
        } catch { showToast('Failed to save', 'error'); }
    }

    const addItem = () => {
        if (data.length >= 6) {
            showToast('Maximum 6 research areas allowed.', 'error');
            return;
        }
        setData([...data, { id: Date.now().toString(), title: '', shortDesc: '', image: '' }]);
    };
    const removeItem = (id: string) => setData(data.filter(item => item.id !== id));
    const updateItem = (id: string, field: string, val: any) => {
        setData(data.map(item => item.id === id ? { ...item, [field]: val } : item));
    };

    function handleFileSelected(id: string, file: File) {
        setCropTarget({ file, id });
    }

    async function handleImageUpload(blob: Blob, id: string) {
        setUploading(id);
        try {
            const fd = new FormData();
            fd.append('id', `research-${id}`);
            fd.append('file', new File([blob], `research-${id}.jpg`, { type: 'image/jpeg' }));
            
            const res = await fetch('/api/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            
            updateItem(id, 'image', r.path);
            showToast('Image uploaded and updated!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        setUploading(null);
    }

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} /> Loading research areas...</div>;

    return (
        <div>
            {/* Image Crop Modal */}
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.id}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Research Areas</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage the research categories shown on the absolute home page.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{data.length}/6 slots used</div>
                    <button 
                        onClick={addItem} 
                        disabled={data.length >= 6} 
                        className="btn" 
                        style={{ gap: '0.5rem', backgroundColor: 'var(--color-bg-gray)', border: '1px solid var(--color-border)', opacity: data.length >= 6 ? 0.5 : 1, cursor: data.length >= 6 ? 'not-allowed' : 'pointer' }}
                    >
                        <Plus size={18} /> Add Area
                    </button>
                    <button onClick={save} className="btn btn-primary" style={{ gap: '0.5rem' }}><Save size={18} /> Save All Changes</button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {data.map((item) => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                            {/* Image Selection & Preview */}
                            <div>
                                <label style={labelStyle}>Area Image</label>
                                <ImagePreview src={item.image} alt={item.title} aspectRatio="16/9" />
                                <div style={{ marginTop: '0.75rem' }}>
                                    <FileUploadButton 
                                        label={item.image ? 'Replace Image' : 'Upload Image'} 
                                        onFile={f => handleFileSelected(item.id, f)} 
                                        uploading={uploading === item.id} 
                                    />
                                </div>
                            </div>

                            {/* Content Fields */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Area Title</label>
                                        <input style={inputStyle} value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="e.g., Herbal Genomics" />
                                    </div>
                                    <button onClick={() => removeItem(item.id)} style={{ ...btnSmall, color: '#ef4444', borderColor: '#fee2e2', marginLeft: '1rem', marginTop: '1.6rem' }}><Trash2 size={14} /> Delete</button>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Short Description</label>
                                    <textarea style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} value={item.shortDesc} onChange={e => updateItem(item.id, 'shortDesc', e.target.value)} placeholder="A brief summary for the home page card..." />
                                </div>
                                <div>
                                    <label style={labelStyle}>Manual Image URL (Optional)</label>
                                    <input style={{ ...inputStyle, fontSize: '0.8rem' }} value={item.image} onChange={e => updateItem(item.id, 'image', e.target.value)} placeholder="/path-to-image.jpg or unsplash URL" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  FACILITIES TAB
// ═══════════════════════════════════════════════════════

function FacilitiesTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; id: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=facilities').then(r => r.json()).then(d => { setData(d); setLoading(false); });
    }, []);

    async function save() {
        try {
            await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'facilities', data })
            });
            showToast('Facilities saved successfully', 'success');
        } catch { showToast('Failed to save', 'error'); }
    }

    const addItem = () => {
        if (data.length >= 6) {
            showToast('Maximum 6 facilities allowed.', 'error');
            return;
        }
        setData([...data, { id: Date.now().toString(), title: '', description: '', image: '', stats: [] }]);
    };
    const removeItem = (id: string) => setData(data.filter(item => item.id !== id));
    const updateItem = (id: string, field: string, val: any) => {
        setData(data.map(item => item.id === id ? { ...item, [field]: val } : item));
    };

    function handleFileSelected(id: string, file: File) {
        setCropTarget({ file, id });
    }

    async function handleImageUpload(blob: Blob, id: string) {
        setUploading(id);
        try {
            const fd = new FormData();
            fd.append('id', `facility-${id}`);
            fd.append('file', new File([blob], `facility-${id}.jpg`, { type: 'image/jpeg' }));
            
            const res = await fetch('/api/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            
            updateItem(id, 'image', r.path);
            showToast('Image uploaded and updated!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        setUploading(null);
    }

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} /> Loading facilities...</div>;

    return (
        <div>
            {/* Image Crop Modal */}
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.id}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Lab Facilities</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage the high-end equipment and lab specialized units.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{data.length}/6 slots used</div>
                    <button 
                        onClick={addItem} 
                        disabled={data.length >= 6} 
                        className="btn" 
                        style={{ gap: '0.5rem', backgroundColor: 'var(--color-bg-gray)', border: '1px solid var(--color-border)', opacity: data.length >= 6 ? 0.5 : 1, cursor: data.length >= 6 ? 'not-allowed' : 'pointer' }}
                    >
                        <Plus size={18} /> Add Facility
                    </button>
                    <button onClick={save} className="btn btn-primary" style={{ gap: '0.5rem' }}><Save size={18} /> Save All Changes</button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {data.map((item) => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                            {/* Image Section */}
                            <div>
                                <label style={labelStyle}>Facility Image</label>
                                <ImagePreview src={item.image} alt={item.title} aspectRatio="16/9" />
                                <div style={{ marginTop: '0.75rem' }}>
                                    <FileUploadButton 
                                        label={item.image ? 'Replace Image' : 'Upload Image'} 
                                        onFile={f => handleFileSelected(item.id, f)} 
                                        uploading={uploading === item.id} 
                                    />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Facility Name</label>
                                        <input style={inputStyle} value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="e.g., Smart Greenhouse" />
                                    </div>
                                    <button onClick={() => removeItem(item.id)} style={{ ...btnSmall, color: '#ef4444', borderColor: '#fee2e2', marginLeft: '1rem', marginTop: '1.6rem' }}><Trash2 size={14} /> Delete</button>
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                                </div>
                                
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Facility Stats (Labels & Values)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {(item.stats || []).map((s: any, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input style={{ ...inputStyle, flex: 1 }} value={s.label} placeholder="Label" onChange={e => {
                                                    const stats = [...item.stats];
                                                    stats[idx].label = e.target.value;
                                                    updateItem(item.id, 'stats', stats);
                                                }} />
                                                <input style={{ ...inputStyle, flex: 1 }} value={s.value} placeholder="Value" onChange={e => {
                                                    const stats = [...item.stats];
                                                    stats[idx].value = e.target.value;
                                                    updateItem(item.id, 'stats', stats);
                                                }} />
                                                <button onClick={() => {
                                                    const stats = item.stats.filter((_: any, i: number) => i !== idx);
                                                    updateItem(item.id, 'stats', stats);
                                                }} style={{ ...btnIcon, color: '#ef4444' }}><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            const stats = [...(item.stats || []), { label: '', value: '' }];
                                            updateItem(item.id, 'stats', stats);
                                        }} style={{ ...btnSmall, borderStyle: 'dashed', justifyContent: 'center' }}><Plus size={14} /> Add New Stat</button>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Manual Image URL (Optional)</label>
                                    <input style={{ ...inputStyle, fontSize: '0.8rem' }} value={item.image} onChange={e => updateItem(item.id, 'image', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  GOALS TAB
// ═══════════════════════════════════════════════════════

function GoalsTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; id: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=goals').then(r => r.json()).then(d => { setData(d); setLoading(false); });
    }, []);

    async function save() {
        try {
            await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'goals', data })
            });
            showToast('Goals saved successfully', 'success');
        } catch { showToast('Failed to save', 'error'); }
    }

    const addItem = () => {
        if (data.length >= 6) {
            showToast('Maximum 6 strategic goals allowed.', 'error');
            return;
        }
        setData([...data, { id: Date.now().toString(), title: '', description: '', progress: 0, target: '', image: '' }]);
    };
    const removeItem = (id: string) => setData(data.filter(item => item.id !== id));
    const updateItem = (id: string, field: string, val: any) => {
        setData(data.map(item => item.id === id ? { ...item, [field]: val } : item));
    };

    function handleFileSelected(id: string, file: File) {
        setCropTarget({ file, id });
    }

    async function handleImageUpload(blob: Blob, id: string) {
        setUploading(id);
        try {
            const fd = new FormData();
            fd.append('id', `goal-${id}`);
            fd.append('file', new File([blob], `goal-${id}.jpg`, { type: 'image/jpeg' }));
            
            const res = await fetch('/api/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            
            updateItem(id, 'image', r.path);
            showToast('Goal image updated!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        setUploading(null);
    }

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} /> Loading goals...</div>;

    return (
        <div>
            {/* Image Crop Modal */}
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.id}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Strategic Goals</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Track and display the lab&apos;s progress on key milestones.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{data.length}/6 slots used</div>
                    <button 
                        onClick={addItem} 
                        disabled={data.length >= 6} 
                        className="btn" 
                        style={{ gap: '0.5rem', backgroundColor: 'var(--color-bg-gray)', border: '1px solid var(--color-border)', opacity: data.length >= 6 ? 0.5 : 1, cursor: data.length >= 6 ? 'not-allowed' : 'pointer' }}
                    >
                        <Plus size={18} /> Add Goal
                    </button>
                    <button onClick={save} className="btn btn-primary" style={{ gap: '0.5rem' }}><Save size={18} /> Save All Changes</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
                {data.map((item) => (
                    <div key={item.id} style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Goal Title</label>
                                <input style={{ ...inputStyle, fontWeight: 700 }} value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} />
                            </div>
                            <button onClick={() => removeItem(item.id)} style={{ ...btnIcon, color: '#ef4444', marginLeft: '1rem' }}><Trash2 size={16} /></button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Target Date</label>
                                <input style={inputStyle} value={item.target} onChange={e => updateItem(item.id, 'target', e.target.value)} placeholder="e.g. June 2026" />
                            </div>
                            <div>
                                <label style={labelStyle}>Progress ({item.progress}%)</label>
                                <input type="range" min="0" max="100" style={{ width: '100%', accentColor: 'var(--color-primary)', marginTop: '0.5rem' }} value={item.progress} onChange={e => updateItem(item.id, 'progress', parseInt(e.target.value))} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Background / Featured Image</label>
                            <ImagePreview src={item.image} alt={item.title} aspectRatio="16/9" />
                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                <FileUploadButton 
                                    label={item.image ? 'Replace Image' : 'Upload Image'} 
                                    onFile={f => handleFileSelected(item.id, f)} 
                                    uploading={uploading === item.id} 
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea style={{ ...inputStyle, minHeight: '60px', fontSize: '0.85rem' }} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                        </div>

                        <div>
                            <label style={labelStyle}>Manual Image URL (Optional)</label>
                            <input style={{ ...inputStyle, fontSize: '0.75rem' }} value={item.image} onChange={e => updateItem(item.id, 'image', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsTab({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
    const [settings, setSettings] = useState({ adminId: '', password: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin-data?type=settings').then(r => r.json()).then(setSettings);
    }, []);

    async function save() {
        setSaving(true);
        try {
            await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'settings', data: settings })
            });
            showToast('Settings saved! Next login will require new credentials.', 'success');
        } catch { showToast('Failed to save settings', 'error'); }
        setSaving(false);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text-main)' }}>Admin Settings</h1>
                <button onClick={save} disabled={saving} className="btn btn-primary" style={{ gap: '0.5rem', opacity: saving ? 0.6 : 1 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />} Save Settings
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--color-border)', maxWidth: '600px' }}>
                <h3 style={{ ...sectionHeader, marginBottom: '2rem' }}>Authentication Credentials</h3>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={labelStyle}>Admin ID (Email or Username)</label>
                        <input 
                            style={inputStyle} 
                            value={settings.adminId} 
                            onChange={e => setSettings({ ...settings, adminId: e.target.value })} 
                            placeholder="e.g. abinaya222@gmail.com"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>This ID will be used for all future admin panel logins.</p>
                    </div>

                    <div>
                        <label style={labelStyle}>Admin Password</label>
                        <input 
                            type="password"
                            style={inputStyle} 
                            value={settings.password} 
                            onChange={e => setSettings({ ...settings, password: e.target.value })} 
                            placeholder="Enter new password"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>Ensure your password is secure and not easily guessable.</p>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', padding: '1.25rem', backgroundColor: 'rgba(232, 93, 4, 0.05)', borderRadius: '8px', border: '1px solid rgba(232, 93, 4, 0.2)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <AlertCircle size={18} color="#e85d04" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e85d04', margin: 0 }}>Security Notice</p>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(232, 93, 4, 0.8)', margin: '0.25rem 0 0 0' }}>Updating these credentials will apply immediately. You may be asked to re-authenticate on your next session visit. Keep these credentials in a safe place.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SimpleTableTab({ title, data }: { title: string; data: { id: string; title: string }[] }) {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            This tab is being deprecated. Use the specific management tabs for {title}.
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════

function ImageCard({ memberKey, label, imagePath, uploading, onUpload, onDelete }: {
    memberKey: string; label: string; imagePath?: string; uploading: boolean;
    onUpload: (f: File) => void; onDelete: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div style={{ backgroundColor: 'var(--color-bg-white)', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', backgroundColor: 'rgba(85,81,255,0.08)', padding: '0.3rem 0.75rem', borderRadius: '100px' }}>{label}</div>
            <ImageCircle src={imagePath} size={120} />
            <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ''; }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={() => ref.current?.click()} disabled={uploading} style={{ ...btnSmall, color: 'var(--color-primary)', border: '1px solid var(--color-primary)', backgroundColor: 'rgba(85,81,255,0.05)' }}>
                    {uploading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />} {imagePath ? 'Replace' : 'Upload'}
                </button>
                {imagePath && <button onClick={onDelete} style={{ ...btnSmall, color: '#ef4444', border: '1px solid #fca5a5', backgroundColor: 'rgba(239,68,68,0.05)' }}><Trash2 size={13} /> Delete</button>}
            </div>
        </div>
    );
}

function ImageCircle({ src, size }: { src?: string; size: number }) {
    const [ts, setTs] = useState<number | null>(null);
    useEffect(() => { if (src) setTs(Date.now()); }, [src]);
    
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {src ? <Image src={ts ? `${src}?t=${ts}` : src} alt="" width={size} height={size} style={{ objectFit: 'cover', width: '100%', height: '100%' }} unoptimized /> : <ImageIcon size={size * 0.3} style={{ color: '#cbd5e1' }} />}
        </div>
    );
}

function FileUploadButton({ label, onFile, uploading }: { label: string; onFile: (f: File) => void; uploading: boolean }) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <>
            <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
            <button onClick={() => ref.current?.click()} disabled={uploading} style={{ ...btnSmall, flex: 1, color: '#059669', border: '1px solid #a7f3d0', backgroundColor: 'rgba(5,150,105,0.05)' }}>
                {uploading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />} {label}
            </button>
        </>
    );
}

// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--color-border)',
    fontSize: '0.9rem', color: 'var(--color-text-main)', backgroundColor: 'var(--color-bg-white)',
    outline: 'none', transition: 'border 0.2s',
};

const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600,
    color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px',
};

const sectionHeader: React.CSSProperties = {
    fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--color-accent)', display: 'inline-block', marginBottom: '0',
};

const btnSmall: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.7rem',
    borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--color-border)',
    backgroundColor: 'transparent', transition: 'all 0.2s',
};

const btnIcon: React.CSSProperties = {
    padding: '0.4rem', background: 'transparent', border: '1px solid var(--color-border)',
    borderRadius: '6px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center',
};

const thStyle: React.CSSProperties = {
    padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase',
};

function CountdownCard({ date, time, title, number, location }: { date: string; time: string; title: string; number: string; location: string }) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!date) return;
        const target = new Date(`${date}T${time || '00:00'}:00`).getTime();
        const interval = setInterval(() => {
            const dist = target - Date.now();
            if (dist < 0) { 
                clearInterval(interval); 
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
                return; 
            }
            setCountdown({
                days: Math.floor(dist / 86400000),
                hours: Math.floor((dist % 86400000) / 3600000),
                minutes: Math.floor((dist % 3600000) / 60000),
                seconds: Math.floor((dist % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [date, time]);

    return (
        <div style={{ backgroundColor: '#4f46e5', borderRadius: '16px', padding: '2.5rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(79,70,229,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            
            <p style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.75rem', fontWeight: 600, color: 'white' }}>Up Next: {number || 'Unnamed'}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', textAlign: 'center', color: 'white' }}>{title || 'Untitled Meeting'}</h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', color: 'white' }}>
                {(mounted && date) ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : (date ? 'Loading date...' : 'Date not set')}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', textAlign: 'center' }}>
                {[
                    { val: countdown.days, label: 'Days' },
                    { val: countdown.hours, label: 'Hours' },
                    { val: countdown.minutes, label: 'Min' },
                    { val: countdown.seconds, label: 'Sec' },
                ].map(t => (
                    <div key={t.label} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.25rem 0.5rem', minWidth: '75px' }}>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, color: 'white' }}>{String(t.val).padStart(2, '0')}</div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'white' }}>{t.label}</div>
                    </div>
                ))}
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '0.5rem 1rem', borderRadius: '100px' }}>
                <MapPin size={16} /> {location || 'Location TBD'}
            </p>
        </div>
    );
}

function getTabStyle(isActive: boolean): React.CSSProperties {
    return {
        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem',
        borderRadius: 'var(--border-radius-sm)', border: 'none',
        backgroundColor: isActive ? 'rgba(85, 81, 255, 0.1)' : 'transparent',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        fontWeight: isActive ? 600 : 500, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
    };
}
