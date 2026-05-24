import React, { useState, useEffect, useMemo } from 'react';
import { 
    Save, 
    Loader2, 
    LayoutDashboard, 
    Hash, 
    MapPin, 
    CalendarDays, 
    Clock, 
    Plus, 
    Edit2, 
    Check, 
    Trash2, 
    History, 
    Eye, 
    Download, 
    AlertCircle,
    Calendar
} from 'lucide-react';
import { SessionsData, Presenter, HistoryEntry } from '@/types';
import { AdminCard, AdminInput, AdminButton, AdminTable, AdminTd } from './SharedUI';

/**
 * 🗓️ SESSIONS TAB
 * ---------------
 * Manages lab meetings, presenters, and archive history.
 */
export const SessionsTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [data, setData] = useState<SessionsData | null>(null);
    const [saving, setSaving] = useState(false);
    const [editingPresenter, setEditingPresenter] = useState<string | null>(null);
    const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=sessions')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setData(d);
                else showToast('Failed to load sessions', 'error');
            })
            .catch(() => showToast('Network error loading sessions', 'error'));
    }, []);

    async function save(updated: SessionsData) {
        setSaving(true);
        try {
            await fetch('/api/admin-data', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ type: 'sessions', data: updated }) 
            });
            setData(updated);
            showToast('Sessions saved successfully', 'success');
        } catch { 
            showToast('Failed to save sessions', 'error'); 
        } finally {
            setSaving(false);
        }
    }

    const updateMeeting = (field: string, value: string) => {
        if (!data) return;
        setData({ ...data, meeting: { ...data.meeting, [field]: value } });
    };

    const addPresenter = () => {
        if (!data) return;
        const newP: Presenter = { id: Date.now().toString(), presenter: '', topic: '', time: '', status: 'scheduled' };
        setData({ ...data, presenters: [...data.presenters, newP] });
        setEditingPresenter(newP.id);
    };

    const updatePresenter = (id: string, field: string, value: string) => {
        if (!data) return;
        setData({ 
            ...data, 
            presenters: data.presenters.map(p => p.id === id ? { ...p, [field]: value } : p) 
        });
    };

    const deletePresenter = (id: string) => {
        if (!data) return;
        setData({ 
            ...data, 
            presenters: data.presenters.filter(p => p.id !== id) 
        });
    };

    const downloadHistory = () => {
        if (!data || !data.history || data.history.length === 0) {
            showToast('No history to export', 'error');
            return;
        }

        const headers = ['Date', 'Title', 'Number', 'Presenter', 'Topic', 'Time', 'Status', 'Purpose', 'Location'];
        const rows = data.history.flatMap(h => 
            h.presenters.length > 0 ? h.presenters.map(p => [
                h.date, h.title, h.number, p.presenter, p.topic, p.time, p.status, h.purpose, h.location
            ]) : [[h.date, h.title, h.number, 'None', '-', '-', '-', h.purpose, h.location]]
        );

        const csvContent = [headers, ...rows].map(row => row.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Lab_History_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    const archiveSession = () => {
        if (!data || !window.confirm('Archive current session and clear workspace?')) return;
        
        const entry: HistoryEntry = {
            id: Date.now().toString(),
            ...data.meeting,
            presenters: data.presenters,
            archivedAt: new Date().toISOString(),
        };
        
        const updated: SessionsData = {
            meeting: { title: '', number: '', purpose: '', date: '', time: '', location: data.meeting.location },
            presenters: [],
            history: [entry, ...(data.history || [])],
        };
        
        save(updated);
    };

    if (!data) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading...</div>;

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Manage Sessions</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Configure lab meetings and track researcher presentations.</p>
                </div>
                <AdminButton onClick={() => save(data)} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save All Changes
                </AdminButton>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <AdminCard title="Current Session Setup" icon={<LayoutDashboard size={20} className="text-primary" />}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <AdminInput label="Meeting Title" value={data.meeting.title} onChange={e => updateMeeting('title', e.target.value)} placeholder="e.g. Weekly Progress Review" />
                        </div>
                        <AdminInput label="Meeting Number" value={data.meeting.number} onChange={e => updateMeeting('number', e.target.value)} placeholder="e.g. 15th" />
                        <AdminInput label="Location" value={data.meeting.location} onChange={e => updateMeeting('location', e.target.value)} placeholder="e.g. Room 38, SCIS" />
                        <AdminInput type="date" label="Date" value={data.meeting.date} onChange={e => updateMeeting('date', e.target.value)} />
                        <AdminInput type="time" label="Time" value={data.meeting.time} onChange={e => updateMeeting('time', e.target.value)} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>Purpose & Agenda</label>
                            <textarea 
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '100px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                                value={data.meeting.purpose} 
                                onChange={e => updateMeeting('purpose', e.target.value)} 
                                placeholder="Describe the focus..." 
                            />
                        </div>
                    </div>
                </AdminCard>

                <CountdownCard 
                    date={data.meeting.date} 
                    time={data.meeting.time} 
                    title={data.meeting.title} 
                    number={data.meeting.number} 
                    location={data.meeting.location} 
                />
            </div>

            <AdminCard 
                title="Presenters" 
                subtitle="Researchers scheduled for the current session."
                extra={
                    <AdminButton variant="primary" onClick={addPresenter}>
                        <Plus size={16} /> Add Presenter
                    </AdminButton>
                }
            >
                <AdminTable headers={['#', 'Name', 'Topic', 'Time', 'Status', 'Actions']}>
                    {data.presenters.length === 0 ? (
                        <tr>
                            <AdminTd align="center"><span style={{ color: 'var(--color-primary, #2d6a4f)', fontWeight: 600 }}>No presenters added yet.</span></AdminTd>
                        </tr>
                    ) : (
                        data.presenters.map((p, idx) => (
                            <tr key={p.id}>
                                <AdminTd bold>{idx + 1}</AdminTd>
                                <AdminTd>
                                    {editingPresenter === p.id ? (
                                        <input style={{ padding: '0.4rem', border: '1px solid var(--admin-input-border)', borderRadius: '4px', width: '100%', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={p.presenter} onChange={e => updatePresenter(p.id, 'presenter', e.target.value)} />
                                    ) : (
                                        <span style={{ fontWeight: 600 }}>{p.presenter || '—'}</span>
                                    )}
                                </AdminTd>
                                <AdminTd>
                                    {editingPresenter === p.id ? (
                                        <input style={{ padding: '0.4rem', border: '1px solid var(--admin-input-border)', borderRadius: '4px', width: '100%', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={p.topic} onChange={e => updatePresenter(p.id, 'topic', e.target.value)} />
                                    ) : (
                                        <span style={{ fontSize: '0.85rem' }}>{p.topic || '—'}</span>
                                    )}
                                </AdminTd>
                                <AdminTd>
                                    {editingPresenter === p.id ? (
                                        <input style={{ padding: '0.4rem', border: '1px solid var(--admin-input-border)', borderRadius: '4px', width: '100%', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={p.time} onChange={e => updatePresenter(p.id, 'time', e.target.value)} />
                                    ) : (
                                        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{p.time || '—'}</span>
                                    )}
                                </AdminTd>
                                <AdminTd>
                                    <select 
                                        value={p.status} 
                                        onChange={e => updatePresenter(p.id, 'status', e.target.value)}
                                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--admin-input-border)', fontSize: '0.8rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }}
                                    >
                                        {['scheduled', 'completed', 'cancelled', 'delayed'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </AdminTd>
                                <AdminTd align="right">
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setEditingPresenter(editingPresenter === p.id ? null : p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                                            {editingPresenter === p.id ? <Check size={18} /> : <Edit2 size={18} />}
                                        </button>
                                        <button onClick={() => deletePresenter(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </AdminTd>
                            </tr>
                        ))
                    )}
                </AdminTable>
            </AdminCard>

            <AdminCard 
                title="Session Record History" 
                subtitle="Past meeting logs and archived data."
                extra={
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <AdminButton variant="secondary" onClick={downloadHistory}>
                            <Download size={16} /> Export CSV
                        </AdminButton>
                        <AdminButton variant="secondary" style={{ backgroundColor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary, #2d6a4f)', borderColor: 'var(--color-primary, #2d6a4f)' }} onClick={archiveSession}>
                            <History size={16} /> Archive Session
                        </AdminButton>
                    </div>
                }
            >
                <AdminTable headers={['Meeting', 'Stats', 'Presenters', 'Date', 'Actions']}>
                    {(!data.history || data.history.length === 0) ? (
                        <tr><AdminTd align="center"><span style={{ color: 'var(--color-primary, #2d6a4f)', fontWeight: 600 }}>No archived sessions.</span></AdminTd></tr>
                    ) : (
                        data.history.map(h => (
                            <tr key={h.id}>
                                <AdminTd bold>{h.number} Meeting<br/><span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>{h.title}</span></AdminTd>
                                <AdminTd>{h.presenters.length} Presenters</AdminTd>
                                <AdminTd>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        {h.presenters.slice(0, 2).map(p => p.presenter).join(', ')}{h.presenters.length > 2 && '...'}
                                    </div>
                                </AdminTd>
                                <AdminTd>{new Date(h.archivedAt).toLocaleDateString()}</AdminTd>
                                <AdminTd align="right">
                                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                        <Eye size={18} />
                                    </button>
                                </AdminTd>
                            </tr>
                        ))
                    )}
                </AdminTable>
            </AdminCard>
        </div>
    );
};

// ─── Sub-Component ──────────────────────────────────────────

function CountdownCard({ date, time, title, number, location }: { date: string; time: string; title: string; number: string; location: string }) {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        if (!date) return;
        const target = new Date(`${date}T${time || '00:00'}:00`).getTime();
        const timer = setInterval(() => {
            const now = Date.now();
            const dist = target - now;
            if (dist < 0) {
                setIsPast(true);
                clearInterval(timer);
            } else {
                setTimeLeft({
                    d: Math.floor(dist / (1000 * 60 * 60 * 24)),
                    h: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((dist % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [date, time]);

    return (
        <div style={{ 
            background: 'var(--admin-card-bg)', 
            borderRadius: '16px', padding: '2rem', color: 'var(--admin-text-main)', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--admin-border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                <Calendar size={20} color="var(--color-primary, #2d6a4f)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)' }}>NEXT SESSION PREVIEW</span>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--admin-title-color, #2d6a4f)' }}>{number} Lab Meeting</h2>
            <p style={{ color: 'var(--admin-text-muted, #475569)', fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 500 }}>{title || 'No title set'}</p>

            {isPast ? (
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(45, 106, 79, 0.1)', borderRadius: '12px', textAlign: 'center', color: 'var(--color-primary, #2d6a4f)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SESSION CONCLUDED</span>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    {[
                        { v: timeLeft.d, l: 'Days' },
                        { v: timeLeft.h, l: 'Hrs' },
                        { v: timeLeft.m, l: 'Mins' },
                        { v: timeLeft.s, l: 'Secs' }
                    ].map(t => (
                        <div key={t.l} style={{ textAlign: 'center', backgroundColor: 'rgba(45, 106, 79, 0.1)', padding: '0.75rem 0.5rem', borderRadius: '12px', color: 'var(--admin-title-color, #2d6a4f)' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{String(t.v).padStart(2, '0')}</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>{t.l}</div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(45, 106, 79, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--admin-text-muted, #475569)', fontWeight: 600 }}>
                <MapPin size={16} color="var(--color-primary, #2d6a4f)" /> {location || 'TBD'}
            </div>
        </div>
    );
}
