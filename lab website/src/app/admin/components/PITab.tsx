import React, { useState, useEffect, useRef } from 'react';
import { 
    Save, 
    Loader2, 
    Link2, 
    Plus, 
    Trash2, 
    Eye, 
    Upload, 
    ImageIcon,
    Mail,
    MapPin,
    Quote
} from 'lucide-react';
import Image from 'next/image';
import { PIData, Publication } from '@/types';
import { AdminCard, AdminInput, AdminButton } from './SharedUI';
import ImageCropModal from '@/components/ui/ImageCropModal';

/**
 * 🎓 PI PROFILE TAB
 * ----------------
 * Manages the Principal Investigator's profile, photos, and publications.
 */
export const PITab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [data, setData] = useState<PIData | null>(null);
    const [saving, setSaving] = useState(false);
    const [teamImages, setTeamImages] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; memberKey: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin-data?type=pi')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setData(d);
                else showToast('Failed to load PI profile', 'error');
            });
        fetch('/api/team-images')
            .then(r => r.json())
            .then(d => {
                if (d && !d.error) setTeamImages(d);
            });
    }, []);

    const save = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch('/api/admin-data', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ type: 'pi', data }) 
            });
            showToast('PI profile saved!', 'success');
        } catch { 
            showToast('Save failed', 'error'); 
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelected = (key: string, file: File) => {
        setCropTarget({ file, memberKey: key });
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
            showToast('Image updated!', 'success');
        } catch { 
            showToast('Upload failed', 'error'); 
        } finally {
            setUploading(null);
        }
    };

    const handleImageDelete = async (key: string) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await fetch('/api/team-images', { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ memberKey: key }) 
            });
            setTeamImages(prev => { 
                const n = { ...prev }; 
                delete n[key]; 
                return n; 
            });
            showToast('Image deleted!', 'success');
        } catch { 
            showToast('Delete failed', 'error'); 
        }
    };

    if (!data) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading...</div>;

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
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>PI Profile</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your personal details, photos, and published research.</p>
                </div>
                <AdminButton onClick={save} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save All Changes
                </AdminButton>
            </header>

            {/* Photos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { id: 'pi-detail', label: 'Profile Card photo' },
                    { id: 'pi-tree', label: 'Team Tree photo' }
                ].map(slot => (
                    <ImageCard 
                        key={slot.id} 
                        label={slot.label} 
                        imagePath={teamImages[slot.id]} 
                        uploading={uploading === slot.id}
                        onUpload={(f: File) => handleFileSelected(slot.id, f)} 
                        onDelete={() => handleImageDelete(slot.id)} 
                    />
                ))}
            </div>

            {/* Profile Fields */}
            <AdminCard title="Personal Information">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <AdminInput label="Full Name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                    <AdminInput label="Designation" value={data.role} onChange={e => setData({ ...data, role: e.target.value })} />
                    <div style={{ gridColumn: '1 / -1' }}>
                        <AdminInput label="Affiliation" value={data.affiliation} onChange={e => setData({ ...data, affiliation: e.target.value })} />
                    </div>
                    <AdminInput label="Primary Email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                    <AdminInput label="Alternate Email" value={data.altEmail} onChange={e => setData({ ...data, altEmail: e.target.value })} />
                    <AdminInput label="Office Location" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Professional Quote</label>
                        <textarea 
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '80px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                            value={data.quote} 
                            onChange={e => setData({ ...data, quote: e.target.value })} 
                        />
                    </div>
                </div>
            </AdminCard>

            {/* Publications */}
            <AdminCard 
                title={`Publications (${(data.publications || []).length})`} 
                subtitle="Your academic papers and contributions."
                extra={
                    <AdminButton variant="primary" onClick={() => {
                        const pubs = data.publications || [];
                        setData({ ...data, publications: [...pubs, { id: Date.now().toString(), title: '', link: '' }] });
                    }}>
                        <Plus size={16} /> Add Publication
                    </AdminButton>
                }
            >
                {(data.publications || []).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No publications added yet.</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {data.publications.map((pub, idx) => (
                            <div key={pub.id} style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg, #ffffff)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Paper #{idx + 1}</span>
                                    <button onClick={() => {
                                        setData({ ...data, publications: data.publications.filter(p => p.id !== pub.id) });
                                    }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <AdminInput label="Title" value={pub.title} onChange={e => {
                                        const pubs = [...data.publications];
                                        pubs[idx] = { ...pubs[idx], title: e.target.value };
                                        setData({ ...data, publications: pubs });
                                    }} />
                                    <AdminInput label="Link (URL)" value={pub.link} onChange={e => {
                                        const pubs = [...data.publications];
                                        pubs[idx] = { ...pubs[idx], link: e.target.value };
                                        setData({ ...data, publications: pubs });
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminCard>
        </div>
    );
};

// ─── Sub-Components ─────────────────────────────────────────

function ImageCard({ label, imagePath, uploading, onUpload, onDelete }: any) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div style={{ backgroundColor: 'var(--admin-card-bg, #f1f8f5)', borderRadius: '16px', border: '1px solid var(--admin-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', marginBottom: '1.25rem', backgroundColor: 'var(--admin-table-row)', padding: '0.3rem 0.8rem', borderRadius: '100px' }}>{label}</span>
            <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--admin-border)', marginBottom: '1.25rem', position: 'relative' }}>
                {imagePath ? <Image src={imagePath} alt="" fill style={{ objectFit: 'cover' }} unoptimized /> : <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--admin-placeholder-bg, #e8f5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={40} color="#52b788" /></div>}
            </div>
            <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ''; }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AdminButton variant="secondary" style={{ color: 'var(--color-primary, #2d6a4f)' }} onClick={() => ref.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 size={14} className="spinner" /> : <Upload size={14} />} {imagePath ? 'Replace' : 'Upload'}
                </AdminButton>
                {imagePath && <AdminButton variant="danger" onClick={onDelete}><Trash2 size={14} /></AdminButton>}
            </div>
        </div>
    );
}
