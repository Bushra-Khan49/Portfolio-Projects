import React, { useState, useEffect, useRef } from 'react';
import { 
    Save, 
    Loader2, 
    Plus, 
    Trash2, 
    Edit2, 
    Check, 
    Upload, 
    ImageIcon, 
    Users,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Image from 'next/image';
import { TeamData, TeamMember } from '@/types';
import { AdminCard, AdminInput, AdminButton, AdminTable, AdminTd } from './SharedUI';
import ImageCropModal from '@/components/ui/ImageCropModal';

/**
 * 👥 TEAM TAB
 * -----------
 * Manage lab members across different categories (PhD, RA, Interns).
 */
export const TeamTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [data, setData] = useState<TeamData | null>(null);
    const [teamImages, setTeamImages] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; memberKey: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=team')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setData(d);
                else showToast('Failed to load team data', 'error');
            });
        fetch('/api/team-images')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setTeamImages(d);
            });
    }, []);

    const save = async (updated: TeamData) => {
        setSaving(true);
        try {
            await fetch('/api/admin-data', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ type: 'team', data: updated }) 
            });
            setData(updated);
            showToast('Team roster updated!', 'success');
        } catch { 
            showToast('Failed to save team', 'error'); 
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelected = (memberKey: string, file: File) => {
        setCropTarget({ file, memberKey });
    };

    const handleImageUpload = async (blob: Blob, memberKey: string) => {
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
            showToast('Photo uploaded!', 'success');
        } catch { 
            showToast('Upload failed', 'error'); 
        } finally {
            setUploading(null);
        }
    };

    const handleImageDelete = async (memberKey: string) => {
        if (!window.confirm('Delete this photo?')) return;
        try {
            await fetch('/api/team-images', { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ memberKey }) 
            });
            setTeamImages(prev => { 
                const next = { ...prev }; 
                delete next[memberKey]; 
                return next; 
            });
            showToast('Photo removed', 'success');
        } catch { 
            showToast('Delete failed', 'error'); 
        }
    };

    const getMemberKey = (category: string, name: string) => {
        const prefix = category === 'phdScholars' ? 'phd' : category === 'researchAssociates' ? 'ra' : 'intern';
        return `${prefix}-${(name || 'unnamed').toLowerCase().replace(/\s+/g, '-')}`;
    };

    const addMember = (category: keyof TeamData) => {
        if (!data) return;
        const roleMap = { phdScholars: 'PhD Scholar', researchAssociates: 'Research Associate', interns: 'Intern' };
        const newM: TeamMember = { id: Date.now().toString(), name: '', role: roleMap[category] };
        setData({ ...data, [category]: [...data[category], newM] });
        setEditingId(newM.id);
    };

    const updateMember = (category: keyof TeamData, id: string, field: string, value: string) => {
        if (!data) return;
        setData({ 
            ...data, 
            [category]: data[category].map(m => m.id === id ? { ...m, [field]: value } : m) 
        });
    };

    const deleteMember = (category: keyof TeamData, id: string) => {
        if (!data) return;
        setData({ 
            ...data, 
            [category]: data[category].filter(m => m.id !== id) 
        });
    };

    if (!data) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading...</div>;

    const categories: { key: keyof TeamData; label: string }[] = [
        { key: 'phdScholars', label: 'PhD Scholars' },
        { key: 'researchAssociates', label: 'Research Associates' },
        { key: 'interns', label: 'Interns' },
    ];

    return (
        <div className="fade-in">
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.memberKey}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Manage Team</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Update student records and upload profile photos.</p>
                </div>
                <AdminButton onClick={() => save(data)} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save All Changes
                </AdminButton>
            </header>

            {categories.map(cat => (
                <AdminCard 
                    key={cat.key}
                    title={cat.label}
                    icon={<Users size={20} className="text-primary" />}
                    extra={
                        <AdminButton variant="primary" onClick={() => addMember(cat.key)}>
                            <Plus size={16} /> Add Member
                        </AdminButton>
                    }
                >
                    <AdminTable headers={['Photo', 'Name', 'Role', 'Actions']}>
                        {data[cat.key].length === 0 ? (
                            <tr><AdminTd align="center" children="No members in this category." /></tr>
                        ) : (
                            data[cat.key].map(m => {
                                const mKey = getMemberKey(cat.key, m.name);
                                const imgPath = teamImages[mKey];
                                return (
                                    <tr key={m.id}>
                                        <AdminTd>
                                            <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                                <ImageCircle src={imgPath} size={40} />
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    style={{ display: 'none' }} 
                                                    id={`file-${m.id}`}
                                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelected(mKey, f); }}
                                                />
                                                <button 
                                                    onClick={() => document.getElementById(`file-${m.id}`)?.click()}
                                                    style={{ 
                                                        position: 'absolute', bottom: -4, right: -4, 
                                                        backgroundColor: 'var(--color-primary)', color: 'white', 
                                                        border: 'none', borderRadius: '50%', width: '18px', height: '18px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <Upload size={10} />
                                                </button>
                                            </div>
                                        </AdminTd>
                                        <AdminTd>
                                            {editingId === m.id ? (
                                                <input style={{ padding: '0.4rem', border: '1px solid var(--admin-input-border)', borderRadius: '4px', width: '100%', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={m.name} onChange={e => updateMember(cat.key, m.id, 'name', e.target.value)} />
                                            ) : (
                                                <span style={{ fontWeight: 600 }}>{m.name || 'Unnamed Member'}</span>
                                            )}
                                        </AdminTd>
                                        <AdminTd>
                                            {editingId === m.id ? (
                                                <input style={{ padding: '0.4rem', border: '1px solid var(--admin-input-border)', borderRadius: '4px', width: '100%', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} value={m.role} onChange={e => updateMember(cat.key, m.id, 'role', e.target.value)} />
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{m.role}</span>
                                            )}
                                        </AdminTd>
                                        <AdminTd align="right">
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditingId(editingId === m.id ? null : m.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                                                    {editingId === m.id ? <Check size={18} /> : <Edit2 size={18} />}
                                                </button>
                                                {imgPath && (
                                                    <button onClick={() => handleImageDelete(mKey)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#f59e0b' }}>
                                                        <ImageIcon size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteMember(cat.key, m.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </AdminTd>
                                    </tr>
                                );
                            })
                        )}
                    </AdminTable>
                </AdminCard>
            ))}
        </div>
    );
};

function ImageCircle({ src, size }: { src?: string; size: number }) {
    return (
        <div style={{ 
            width: size, height: size, borderRadius: '50%', 
            overflow: 'hidden', backgroundColor: 'var(--admin-placeholder-bg, #e8f5e9)', 
            border: '2px solid var(--admin-border)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
        }}>
            {src ? <Image src={src} alt="" width={size} height={size} style={{ objectFit: 'cover' }} unoptimized /> : <ImageIcon size={size * 0.4} color="#52b788" />}
        </div>
    );
}
