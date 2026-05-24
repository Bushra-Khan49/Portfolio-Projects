import React from 'react';
import { BaseManagementTab } from './BaseManagementTab';
import { AdminInput } from './SharedUI';

export const ResearchTab = ({ showToast }: any) => (
    <BaseManagementTab
        type="research"
        title="Research Areas"
        subtitle="Manage the core research themes displayed on the homepage."
        showToast={showToast}
        gridTemplateColumns="1fr"
        newItemTemplate={() => ({ id: '', title: '', shortDesc: '', longDesc: '', image: '' })}
        renderHeaderFields={(metadata, updateMetadata) => (
            <>
                <AdminInput label="Page Main Title" value={metadata.pageTitle || ''} onChange={e => updateMetadata('pageTitle', e.target.value)} />
                <AdminInput label="Page Subtitle / Description" value={metadata.pageSubtitle || ''} onChange={e => updateMetadata('pageSubtitle', e.target.value)} />
                <AdminInput label="Sidebar Focus Areas Label" value={metadata.sidebarLabel || ''} onChange={e => updateMetadata('sidebarLabel', e.target.value)} />
            </>
        )}
        renderFields={(item, update) => (
            <>
                <AdminInput label="URL Slug / ID (e.g. herbal-genomics)" value={item.id} onChange={e => update('id', e.target.value)} />
                <AdminInput label="Title" value={item.title} onChange={e => update('title', e.target.value)} />
                <AdminInput label="Short Description" value={item.shortDesc} onChange={e => update('shortDesc', e.target.value)} />
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>Detailed Description (Full Matter)</label>
                <textarea 
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--admin-input-border)', borderRadius: '10px', minHeight: '150px', fontSize: '0.9rem', backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} 
                    value={item.longDesc || ''} onChange={e => update('longDesc', e.target.value)} 
                />
            </>
        )}
    />
);
