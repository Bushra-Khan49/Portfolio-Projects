import React from 'react';
import { BaseManagementTab } from './BaseManagementTab';
import { AdminInput } from './SharedUI';

export const GoalsTab = ({ showToast }: any) => (
    <BaseManagementTab
        type="goals"
        title="Lab Goals"
        subtitle="Track progress on strategic milestones and objectives."
        showToast={showToast}
        gridTemplateColumns="1fr"
        newItemTemplate={() => ({ title: '', description: '', target: '', progress: 0, image: '', longDesc: '', breakdown: [] })}
        renderFields={(item, update) => (
            <>
                <AdminInput label="Goal Title" value={item.title} onChange={e => update('title', e.target.value)} />
                <AdminInput label="Target Date" value={item.target} onChange={e => update('target', e.target.value)} />
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-primary, #2d6a4f)' }}>Progress Status ({item.progress}%)</label>
                    <input type="range" min="0" max="100" style={{ width: '100%', accentColor: 'var(--color-accent)' }} value={item.progress} onChange={e => update('progress', parseInt(e.target.value))} />
                </div>
                <AdminInput label="Short Summary" value={item.description} onChange={e => update('description', e.target.value)} />
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>Full Strategic Matter (Long Description)</label>
                <textarea 
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '10px', minHeight: '150px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                    value={item.longDesc || ''} onChange={e => update('longDesc', e.target.value)} 
                />
            </>
        )}
        renderBottomFields={(item, update) => (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 800 }}>Project Phases</h4>
                    <button
                        type="button"
                        onClick={() => {
                            const newPhases = [...(item.breakdown || []), { label: '', plan: '', achieved: '0%', remaining: '100%', desc: '', lastUpdated: '', details: '' }];
                            update('breakdown', newPhases);
                        }}
                        style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                        + Add Phase
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
                    {(item.breakdown || []).map((phase: any, idx: number) => (
                        <div key={idx} style={{ background: 'var(--admin-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '1rem', color: 'var(--admin-text-main)' }}>Phase {idx + 1}</strong>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPhases = [...item.breakdown];
                                        newPhases.splice(idx, 1);
                                        update('breakdown', newPhases);
                                    }}
                                    style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}
                                >
                                    Remove
                                </button>
                            </div>
                            
                            <AdminInput label="Phase Label (e.g. Phase 1: Genome Assembly)" value={phase.label} onChange={e => {
                                const newPhases = [...item.breakdown];
                                newPhases[idx].label = e.target.value;
                                update('breakdown', newPhases);
                            }} />
                            <AdminInput label="Plan Details (e.g. De novo assembly of 10 priority systems)" value={phase.plan} onChange={e => {
                                const newPhases = [...item.breakdown];
                                newPhases[idx].plan = e.target.value;
                                update('breakdown', newPhases);
                            }} />
                            
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 45%' }}>
                                    <AdminInput label="Achieved (e.g. 100%)" value={phase.achieved} onChange={e => {
                                        const newPhases = [...item.breakdown];
                                        newPhases[idx].achieved = e.target.value;
                                        update('breakdown', newPhases);
                                    }} />
                                </div>
                                <div style={{ flex: '1 1 45%' }}>
                                    <AdminInput label="Remaining (e.g. 0%)" value={phase.remaining} onChange={e => {
                                        const newPhases = [...item.breakdown];
                                        newPhases[idx].remaining = e.target.value;
                                        update('breakdown', newPhases);
                                    }} />
                                </div>
                                <div style={{ flex: '1 1 45%' }}>
                                    <AdminInput label="Last Updated (e.g. Nov 2025)" value={phase.lastUpdated || ''} onChange={e => {
                                        const newPhases = [...item.breakdown];
                                        newPhases[idx].lastUpdated = e.target.value;
                                        update('breakdown', newPhases);
                                    }} />
                                </div>
                                <div style={{ flex: '1 1 45%' }}>
                                    <AdminInput label="Execution Details (e.g. 10/10 Priority Genomes Sequenced)" value={phase.details || ''} onChange={e => {
                                        const newPhases = [...item.breakdown];
                                        newPhases[idx].details = e.target.value;
                                        update('breakdown', newPhases);
                                    }} />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>Phase Description</label>
                                <textarea 
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--admin-input-border)', borderRadius: '8px', minHeight: '80px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                                    value={phase.desc || ''} onChange={e => {
                                        const newPhases = [...item.breakdown];
                                        newPhases[idx].desc = e.target.value;
                                        update('breakdown', newPhases);
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    />
);
