import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon2 } from 'lucide-react';
import Image from 'next/image';
import { AdminCard, AdminButton } from './SharedUI';
import ImageCropModal from '@/components/ui/ImageCropModal';

interface BaseManagementTabProps {
    type: 'research' | 'facilities' | 'goals';
    title: string;
    subtitle: string;
    renderFields: (item: any, update: (field: string, val: any) => void) => React.ReactNode;
    renderBottomFields?: (item: any, update: (field: string, val: any) => void) => React.ReactNode;
    renderHeaderFields?: (metadata: any, updateMetadata: (field: string, val: any) => void) => React.ReactNode;
    newItemTemplate: () => any;
    showToast: (m: string, t: 'success' | 'error') => void;
    imageAspectRatio?: string;
    gridTemplateColumns?: string;
}

/**
 * 🛠️ BASE MANAGEMENT TAB
 * ----------------------
 * Reusable logic for Research, Facilities, and Goals.
 */
export const BaseManagementTab = ({ 
    type, title, subtitle, renderFields, renderBottomFields, renderHeaderFields, newItemTemplate, showToast, imageAspectRatio = '16/9', gridTemplateColumns 
}: BaseManagementTabProps) => {
    const [data, setData] = useState<any[]>([]);
    const [rawResponse, setRawResponse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<{ file: File; id: string } | null>(null);

    useEffect(() => {
        fetch(`/api/v1/admin-data?type=${type}`)
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) {
                    if (renderHeaderFields) {
                        const converted = {
                            pageTitle: type === 'research' ? "Research Areas" : "",
                            pageSubtitle: type === 'research' ? "Exploring the molecular frontiers of herbal genomics and plant systems biology to unlock nature's therapeutic potential." : "",
                            sidebarLabel: type === 'research' ? "Focus Areas" : "",
                            areas: d.map((item: any) => ({
                                ...item,
                                longDesc: item.longDesc || item.shortDesc || ''
                            }))
                        };
                        setRawResponse(converted);
                        setData(converted.areas);
                    } else {
                        setRawResponse(d);
                        setData(d);
                    }
                } else {
                    setRawResponse(d);
                    if (d && Array.isArray(d.areas)) {
                        const sanitizedAreas = d.areas.map((item: any) => ({
                            ...item,
                            longDesc: item.longDesc || item.shortDesc || ''
                        }));
                        setData(sanitizedAreas);
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [type, renderHeaderFields]);

    const save = async () => {
        setSaving(true);
        try {
            const payload = (rawResponse && !Array.isArray(rawResponse))
                ? { ...rawResponse, areas: data }
                : data;
            await fetch('/api/v1/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data: payload })
            });
            showToast(`${title} updated!`, 'success');
        } catch { showToast('Save failed', 'error'); }
        finally { setSaving(false); }
    };

    const addItem = () => setData([...data, { ...newItemTemplate(), id: Date.now().toString() }]);
    const removeItem = (id: string) => setData(data.filter(item => item.id !== id));
    const updateItem = (id: string, field: string, val: any) => {
        setData(data.map(item => item.id === id ? { ...item, [field]: val } : item));
    };

    const handleImageUpload = async (blob: Blob, id: string) => {
        setUploading(id);
        try {
            const fd = new FormData();
            fd.append('id', `${type}-${id}`);
            fd.append('file', new File([blob], `${type}-${id}.jpg`, { type: 'image/jpeg' }));
            const res = await fetch('/api/v1/team-images', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Upload failed');
            const r = await res.json();
            updateItem(id, 'image', `${r.path}?t=${Date.now()}`);
            showToast('Image updated!', 'success');
        } catch { showToast('Upload failed', 'error'); }
        finally { setUploading(null); }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spinner" /> Loading...</div>;

    return (
        <div className="fade-in">
            {cropTarget && (
                <ImageCropModal
                    file={cropTarget.file}
                    memberKey={cropTarget.id}
                    onSave={handleImageUpload}
                    onClose={() => setCropTarget(null)}
                />
            )}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>{title}</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <AdminButton variant="primary" onClick={addItem}><Plus size={18} /> Add New</AdminButton>
                    <AdminButton onClick={save} disabled={saving}>
                        {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save All
                    </AdminButton>
                </div>
            </header>

            {renderHeaderFields && rawResponse && !Array.isArray(rawResponse) && (
                <div style={{ marginBottom: '2.5rem' }}>
                    <AdminCard title="Page General Settings">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {renderHeaderFields(rawResponse, (f, v) => {
                                setRawResponse((prev: any) => ({ ...prev, [f]: v }));
                            })}
                        </div>
                    </AdminCard>
                </div>
            )}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: gridTemplateColumns || 'repeat(auto-fill, minmax(480px, 1fr))', 
                gap: '2rem' 
            }}>
                {data.map(item => (
                    <AdminCard 
                        key={item.id} 
                        title={item.title || 'Untitled Item'}
                        extra={<button onClick={() => removeItem(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>}
                    >
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: renderBottomFields ? '1.5rem' : 0 }}>
                            <div style={{ width: '180px', flexShrink: 0 }}>
                                <div style={{ 
                                    aspectRatio: imageAspectRatio, width: '100%', 
                                    backgroundColor: 'var(--admin-placeholder-bg, #e8f5e9)', borderRadius: '8px', 
                                    overflow: 'hidden', position: 'relative', border: '1px solid var(--color-border)' 
                                }}>
                                    {item.image ? <Image src={item.image} alt="" fill style={{ objectFit: 'cover' }} unoptimized /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon2 size={32} color="#52b788" /></div>}
                                    {uploading === item.id && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="spinner" /></div>}
                                </div>
                                <input type="file" accept="image/*" style={{ display: 'none' }} id={`img-${item.id}`} onChange={e => { const f = e.target.files?.[0]; if (f) setCropTarget({ file: f, id: item.id }); }} />
                                <AdminButton 
                                    variant="secondary" 
                                    style={{ width: '100%', marginTop: '0.75rem', padding: '0.4rem', fontSize: '0.75rem', color: 'var(--color-primary, #2d6a4f)' }}
                                    onClick={() => document.getElementById(`img-${item.id}`)?.click()}
                                >
                                    <Upload size={14} /> {item.image ? 'Change Image' : 'Upload Image'}
                                </AdminButton>
                            </div>
                            <div style={{ flex: 1 }}>
                                {renderFields(item, (f, v) => updateItem(item.id, f, v))}
                            </div>
                        </div>
                        {renderBottomFields && (
                            <div style={{ borderTop: '2px dashed var(--admin-border, #e2e8f0)', paddingTop: '1.5rem', width: '100%' }}>
                                {renderBottomFields(item, (f, v) => updateItem(item.id, f, v))}
                            </div>
                        )}
                    </AdminCard>
                ))}
            </div>
        </div>
    );
};
