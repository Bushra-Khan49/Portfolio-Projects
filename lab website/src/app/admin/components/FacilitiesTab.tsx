import React from 'react';
import { BaseManagementTab } from './BaseManagementTab';
import { AdminInput } from './SharedUI';
import { Plus, Trash2 } from 'lucide-react';

export const FacilitiesTab = ({ showToast }: any) => (
    <BaseManagementTab
        type="facilities"
        title="Facilities"
        subtitle="Configure the specialized equipment and infrastructure."
        showToast={showToast}
        gridTemplateColumns="1fr"
        newItemTemplate={() => ({ title: '', description: '', longDesc: '', image: '', stats: [], projects: [] })}
        renderFields={(item, update) => (
            <>
                <AdminInput label="Title" value={item.title} onChange={e => update('title', e.target.value)} />
                <AdminInput label="Description" value={item.description} onChange={e => update('description', e.target.value)} />
                
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>Detailed Info (Full Matter)</label>
                <textarea 
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '10px', minHeight: '120px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)', marginBottom: '1rem' }} 
                    value={item.longDesc || ''} onChange={e => update('longDesc', e.target.value)} 
                />
            </>
        )}
        renderBottomFields={(item, update) => {
            const stats = item.stats || [];
            const projects = item.projects || [];
            
            const updateStats = (newStats: any[]) => {
                update('stats', newStats);
            };

            const addStat = () => {
                updateStats([...stats, { label: '', value: '' }]);
            };

            const removeStat = (index: number) => {
                updateStats(stats.filter((_: any, i: number) => i !== index));
            };

            const updateStatField = (index: number, field: 'label' | 'value', val: string) => {
                updateStats(stats.map((s: any, i: number) => i === index ? { ...s, [field]: val } : s));
            };

            const updateProjects = (newProjects: any[]) => {
                update('projects', newProjects);
            };

            const addProject = () => {
                updateProjects([...projects, { name: 'New Project', settings: [] }]);
            };

            const removeProject = (index: number) => {
                updateProjects(projects.filter((_: any, i: number) => i !== index));
            };

            const updateProjectName = (index: number, name: string) => {
                updateProjects(projects.map((p: any, i: number) => i === index ? { ...p, name } : p));
            };

            const addSetting = (projIndex: number) => {
                updateProjects(projects.map((p: any, i: number) => {
                    if (i === projIndex) {
                        return {
                            ...p,
                            settings: [...(p.settings || []), { key: '', value: '' }]
                        };
                    }
                    return p;
                }));
            };

            const removeSetting = (projIndex: number, setIndex: number) => {
                updateProjects(projects.map((p: any, i: number) => {
                    if (i === projIndex) {
                        return {
                            ...p,
                            settings: (p.settings || []).filter((_: any, sj: number) => sj !== setIndex)
                        };
                    }
                    return p;
                }));
            };

            const updateSetting = (projIndex: number, setIndex: number, field: 'key' | 'value', val: string) => {
                updateProjects(projects.map((p: any, i: number) => {
                    if (i === projIndex) {
                        return {
                            ...p,
                            settings: (p.settings || []).map((s: any, sj: number) => sj === setIndex ? { ...s, [field]: val } : s)
                        };
                    }
                    return p;
                }));
            };

            return (
                <>
                    {/* Facility Stats (Operational Specs) Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Specs (Stats)</span>
                            <button 
                                type="button" 
                                onClick={addStat} 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', background: 'var(--color-primary, #2d6a4f)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                                <Plus size={14} /> Add Spec
                            </button>
                        </div>

                        {stats.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: '0.5rem 0 1rem' }}>No operational specs added yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                {stats.map((s: any, sIdx: number) => (
                                    <div key={sIdx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <input 
                                                type="text" 
                                                placeholder="Label (e.g. CLEAN CLASS)" 
                                                value={s.label} 
                                                onChange={e => updateStatField(sIdx, 'label', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1.5 }}>
                                            <input 
                                                type="text" 
                                                placeholder="Value (e.g. ISO 5 (Class 100))" 
                                                value={s.value} 
                                                onChange={e => updateStatField(sIdx, 'value', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeStat(sIdx)} 
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Research Deployments/Projects Section */}
                    <div style={{ borderTop: '2px dashed var(--admin-input-border, #e2e8f0)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary, #2d6a4f)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Research Deployments</span>
                            <button 
                                type="button" 
                                onClick={addProject} 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', background: 'var(--color-primary, #2d6a4f)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                                <Plus size={14} /> Add Project
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: '0.5rem 0 1rem' }}>No research deployments added yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1rem' }}>
                                {projects.map((proj: any, pIdx: number) => (
                                    <div key={pIdx} style={{ padding: '1.5rem', border: '1px solid var(--admin-input-border, #e2e8f0)', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', position: 'relative' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => removeProject(pIdx)} 
                                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div style={{ width: '90%', marginBottom: '1.5rem' }}>
                                            <AdminInput 
                                                label="Project / Deployment Name" 
                                                value={proj.name} 
                                                onChange={e => updateProjectName(pIdx, e.target.value)} 
                                            />
                                        </div>

                                        {/* Settings / Operational Protocols */}
                                        <div style={{ paddingLeft: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Operational Protocols</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => addSetting(pIdx)} 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: 'none', border: '1px solid var(--color-primary, #2d6a4f)', color: 'var(--color-primary, #2d6a4f)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    <Plus size={12} /> Add Spec
                                                </button>
                                            </div>

                                            {(proj.settings || []).length === 0 ? (
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No protocol settings defined.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {(proj.settings || []).map((setting: any, sIdx: number) => (
                                                        <div key={sIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            <input 
                                                                type="text" 
                                                                placeholder="e.g. Photoperiod" 
                                                                value={setting.key} 
                                                                onChange={e => updateSetting(pIdx, sIdx, 'key', e.target.value)}
                                                                style={{ flex: 1, padding: '0.4rem 0.6rem', border: '1px solid var(--admin-input-border)', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }}
                                                            />
                                                            <input 
                                                                type="text" 
                                                                placeholder="e.g. 16/8h Light/Dark" 
                                                                value={setting.value} 
                                                                onChange={e => updateSetting(pIdx, sIdx, 'value', e.target.value)}
                                                                style={{ flex: 1.5, padding: '0.4rem 0.6rem', border: '1px solid var(--admin-input-border)', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }}
                                                            />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeSetting(pIdx, sIdx)} 
                                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            );
        }}
    />
);
