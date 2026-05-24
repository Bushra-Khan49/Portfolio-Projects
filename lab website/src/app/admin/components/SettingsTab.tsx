import React, { useState, useEffect } from 'react';
import { Save, Loader2, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { AdminCard, AdminInput, AdminButton } from './SharedUI';

/**
 * 🔒 SETTINGS / SECURITY TAB
 * -------------------------
 * Manages administrative credentials and security settings.
 */
export const SettingsTab = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error') => void }) => {
    const [settings, setSettings] = useState({ adminId: '', password: '' });
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetch('/api/v1/admin-data?type=settings')
            .then(r => r.json())
            .then(data => {
                // Password is never sent to client for existing settings
                setSettings(prev => ({ ...prev, adminId: data.adminId || '' }));
            })
            .catch(err => console.error("Failed to load settings:", err));
    }, []);

    const save = async () => {
        if (!settings.adminId) {
            showToast('Admin ID cannot be empty', 'error');
            return;
        }
        setSaving(true);
        try {
            await fetch('/api/v1/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'settings', data: settings })
            });
            showToast('Security settings updated successfully', 'success');
            // Clear password field after save for security
            setSettings(prev => ({ ...prev, password: '' }));
        } catch { 
            showToast('Failed to save settings', 'error'); 
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>Admin Settings</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your administrative credentials and security preferences.</p>
                </div>
                <AdminButton onClick={save} disabled={saving}>
                    {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Save Changes
                </AdminButton>
            </header>

            <div style={{ maxWidth: '640px' }}>
                <AdminCard 
                    title="Authentication Credentials" 
                    icon={<Shield size={20} className="text-primary" />}
                    subtitle="Update your login identity and password."
                >
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <AdminInput 
                                label="Admin ID" 
                                value={settings.adminId} 
                                onChange={e => setSettings({ ...settings, adminId: e.target.value })} 
                                placeholder="e.g. admin@nexusgenomics.edu" 
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-0.75rem' }}>
                                This is your login username. It can be an email or a unique handle.
                            </p>
                        </div>

                        <div>
                            <div style={{ position: 'relative' }}>
                                <AdminInput 
                                    type={showPassword ? "text" : "password"}
                                    label="New Admin Password" 
                                    value={settings.password} 
                                    onChange={e => setSettings({ ...settings, password: e.target.value })} 
                                    placeholder="••••••••••••" 
                                />
                                <button 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', bottom: '0.75rem',
                                        background: 'none', border: 'none', color: '#52b788', cursor: 'pointer',
                                        padding: '0.25rem'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-0.75rem' }}>
                                Leave empty to keep your current password.
                            </p>
                        </div>

                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '1.25rem', 
                            backgroundColor: 'var(--admin-warning-bg, #fff7ed)', 
                            borderRadius: '12px', 
                            border: '1px solid var(--admin-warning-border, #fed7aa)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}>
                            <AlertTriangle size={20} color="var(--admin-warning-text, #ea580c)" style={{ flexShrink: 0 }} />
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--admin-warning-title, #9a3412)', margin: '0 0 0.25rem 0' }}>Critical Notice</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--admin-warning-text, #ea580c)', margin: 0, lineHeight: 1.5 }}>
                                    Changing these credentials will invalidate your current session. 
                                    You will be required to log in again using the new details.
                                </p>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};
