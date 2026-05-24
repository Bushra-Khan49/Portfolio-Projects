import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Mail, Calendar, Trash2, CheckCircle, Clock, XCircle, Eye, Download, ChevronDown } from 'lucide-react';
import { Application } from '@/types';

/**
 * 📄 APPLICATIONS TAB
 * -------------------
 * Review and manage lab join requests.
 */
export const ApplicationsTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/applications')
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setApps(d);
                else showToast('Failed to load applications', 'error');
            })
            .catch(() => showToast('Network error loading applications', 'error'))
            .finally(() => setLoading(false));
    }, [showToast]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/applications', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id, status }) 
            });
            setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            showToast(`Status updated to ${status}`, 'success');
        } catch { 
            showToast('Failed to update status', 'error'); 
        }
    };

    const deleteApp = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
        try {
            await fetch('/api/applications', { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id }) 
            });
            setApps(prev => prev.filter(a => a.id !== id));
            showToast('Application deleted', 'success');
        } catch { 
            showToast('Failed to delete application', 'error'); 
        }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading applications...</div>;

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Lab Applications</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Review prospective students and researchers who applied to join the lab.</p>
            </header>

            {apps.length === 0 ? (
                <div style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: 'var(--admin-card-bg, white)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}><FileText size={48} style={{ opacity: 0.2, margin: '0 auto' }} /></div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>No applications submitted yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {apps.map(app => (
                        <ApplicationCard 
                            key={app.id} 
                            app={app} 
                            onUpdateStatus={updateStatus} 
                            onDelete={deleteApp}
                            onPreview={setPreviewFile}
                        />
                    ))}
                </div>
            )}

            {previewFile && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, 
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'
                }} onClick={() => setPreviewFile(null)}>
                    <div style={{
                        width: '100%', maxWidth: '900px', height: '85vh',
                        backgroundColor: 'var(--admin-bg)', borderRadius: '16px', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between',
                            borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-text-main)' }}>Document Preview</h3>
                            <button onClick={() => setPreviewFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        {previewFile.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                            <img src={previewFile} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', flex: 1 }} />
                        ) : previewFile.match(/\.pdf$/i) ? (
                            <object data={previewFile} type="application/pdf" style={{ width: '100%', flex: 1 }}>
                                <p style={{ padding: '2rem', textAlign: 'center' }}>PDF viewer not available. <a href={previewFile} style={{ color: 'var(--color-primary)' }} download>Download PDF instead.</a></p>
                            </object>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <p>This file type cannot be previewed.</p>
                                <a href={previewFile} download style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>Download File</a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Sub-Component ──────────────────────────────────────────

function ApplicationCard({ app, onUpdateStatus, onDelete, onPreview }: any) {
    const statusColors: any = { 
        pending: { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5', icon: <Clock size={14} /> },
        reviewed: { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe', icon: <Eye size={14} /> },
        accepted: { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7', icon: <CheckCircle size={14} /> },
        rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2', icon: <XCircle size={14} /> }
    };
    const s = statusColors[app.status] || statusColors.pending;

    return (
        <div style={{ backgroundColor: 'var(--admin-card-bg, #ffffff)', borderRadius: '16px', border: '1px solid var(--admin-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', color: 'var(--admin-text-main)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{app.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={14} /> {app.email}</span>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} /> Submitted {new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: '0.8rem', pointerEvents: 'none', color: s.text }}>{s.icon}</div>
                        <select 
                            value={app.status}
                            onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                            style={{ 
                                padding: '0.4rem 1.8rem 0.4rem 2rem', borderRadius: '100px', 
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`,
                                cursor: 'pointer', appearance: 'none', outline: 'none'
                            }}
                        >
                            <option value="pending">PENDING</option>
                            <option value="reviewed">REVIEWED</option>
                            <option value="accepted">ACCEPTED</option>
                            <option value="rejected">REJECTED</option>
                        </select>
                        <div style={{ position: 'absolute', right: '0.6rem', pointerEvents: 'none', color: s.text }}>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <button onClick={() => onDelete(app.id)} style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--admin-bg, #ffffff)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Institute</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.institute}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Position Applied</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.position}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Duration</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.period}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Research Topic</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.topic}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {app.resumePath && (
                        <>
                            <button 
                                onClick={() => onPreview(app.resumePath)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                    padding: '0.6rem 1rem', borderRadius: '8px', 
                                    backgroundColor: 'var(--color-primary)', color: 'white',
                                    fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer'
                                }}
                            >
                                <Eye size={16} /> Quick View
                            </button>
                            <a 
                                href={app.resumePath} 
                                download
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                                    padding: '0.6rem 1rem', borderRadius: '8px', 
                                    backgroundColor: 'transparent', color: 'var(--color-primary)',
                                    border: '1px solid var(--color-primary)',
                                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none'
                                }}
                            >
                                <Download size={16} /> Download
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
