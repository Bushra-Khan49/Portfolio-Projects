import React, { useState, useEffect } from 'react';
import { Save, Loader2, MessageSquare, Target, Compass, Share2, Phone, Mail, Linkedin, Twitter, Plus, Trash2 } from 'lucide-react';
import { AboutData } from '@/types';
import { AdminCard, AdminInput, AdminButton } from './SharedUI';

/**
 * ℹ️ ABOUT PAGE TAB
 * -----------------
 * Edit the Director's Speech, Mission, Vision, and Social/Contact links.
 */
export const AboutTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [data, setData] = useState<AboutData | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin-data?type=about')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setData(d);
                else showToast('Failed to load about data', 'error');
            })
            .catch(() => showToast('Network error loading about data', 'error'));
    }, []);

    const save = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch('/api/admin-data', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ type: 'about', data }) 
            });
            showToast('About page updated!', 'success');
        } catch { 
            showToast('Save failed', 'error'); 
        } finally {
            setSaving(false);
        }
    };

    if (!data) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading...</div>;

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Edit About Page</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage the lab's official speech, mission statement, and contact details.</p>
                </div>
                <AdminButton onClick={save} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save All Changes
                </AdminButton>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                {/* Speech & Mission */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <AdminCard title="Director's Speech" icon={<MessageSquare size={20} className="text-primary" />}>
                        <AdminInput label="Speech Title" value={data.speech.title} onChange={e => setData({ ...data, speech: { ...data.speech, title: e.target.value } })} />
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Main Content (The Speech)</label>
                            <textarea 
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '250px', fontSize: '0.9rem', lineHeight: 1.6, backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                                value={data.speech.content} 
                                onChange={e => setData({ ...data, speech: { ...data.speech, content: e.target.value } })} 
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <AdminInput label="Author Name" value={data.speech.author} onChange={e => setData({ ...data, speech: { ...data.speech, author: e.target.value } })} />
                            <AdminInput label="Designation" value={data.speech.designation} onChange={e => setData({ ...data, speech: { ...data.speech, designation: e.target.value } })} />
                        </div>
                    </AdminCard>

                    <AdminCard title="Core Statements" icon={<Target size={20} className="text-primary" />}>
                        <AdminInput label="Mission Title" value={data.mission.title} onChange={e => setData({ ...data, mission: { ...data.mission, title: e.target.value } })} />
                        <textarea 
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '80px', fontSize: '0.9rem', marginBottom: '1.5rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                            value={data.mission.content} 
                            onChange={e => setData({ ...data, mission: { ...data.mission, content: e.target.value } })} 
                        />
                        <AdminInput label="Vision Title" value={data.vision.title} onChange={e => setData({ ...data, vision: { ...data.vision, title: e.target.value } })} />
                        <textarea 
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '80px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                            value={data.vision.content} 
                            onChange={e => setData({ ...data, vision: { ...data.vision, content: e.target.value } })} 
                        />
                    </AdminCard>
                </div>

                {/* Contacts & History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <AdminCard title="Contact & Social Links" icon={<Share2 size={20} className="text-primary" />}>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <AdminInput label="WhatsApp Number" placeholder="e.g. 919876543210 (No +)" value={data.social.whatsapp} onChange={e => setData({ ...data, social: { ...data.social, whatsapp: e.target.value } })} />
                            <AdminInput label="Public Email" value={data.social.email} onChange={e => setData({ ...data, social: { ...data.social, email: e.target.value } })} />
                            <AdminInput label="LinkedIn URL" value={data.social.linkedin} onChange={e => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })} />
                            <AdminInput label="Twitter / X URL" value={data.social.twitter} onChange={e => setData({ ...data, social: { ...data.social, twitter: e.target.value } })} />
                        </div>
                    </AdminCard>

                    <AdminCard title="Lab History Timeline" icon={<Compass size={20} className="text-primary" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.history.map((h, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '80px' }}>
                                        <input style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-input-border)', borderRadius: '6px', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={h.year} onChange={e => {
                                            const next = [...data.history];
                                            next[i].year = e.target.value;
                                            setData({ ...data, history: next });
                                        }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <textarea style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-input-border)', borderRadius: '6px', minHeight: '60px', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={h.event} onChange={e => {
                                            const next = [...data.history];
                                            next[i].event = e.target.value;
                                            setData({ ...data, history: next });
                                        }} />
                                    </div>
                                    <button onClick={() => setData({ ...data, history: data.history.filter((_, idx) => idx !== i) })} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <AdminButton variant="primary" onClick={() => setData({ ...data, history: [...data.history, { year: '', event: '' }] })}>
                                <Plus size={16} /> Add Milestone
                            </AdminButton>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
};
