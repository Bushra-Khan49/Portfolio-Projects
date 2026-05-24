import React from 'react';
import styles from './AdminUI.module.css';

/**
 * 🍱 SHARED ADMIN UI COMPONENTS
 * -----------------------------
 * These reusable components enforce a consistent design language 
 * across the admin dashboard and significantly reduce line count.
 */

export const AdminCard = ({ 
    children, 
    title, 
    subtitle, 
    icon, 
    extra 
}: { 
    children: React.ReactNode, 
    title?: string, 
    subtitle?: string, 
    icon?: React.ReactNode,
    extra?: React.ReactNode
}) => (
    <div className={styles.card} style={{ backgroundColor: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)' }}>
        {(title || extra) && (
            <div className={styles.cardHeader} style={{ borderBottom: '3px solid var(--admin-title-color)' }}>
                <div>
                    {title && (
                        <h3 className={styles.cardTitle} style={{ color: 'var(--admin-title-color, #061d12)' }}>
                            {icon} {title}
                        </h3>
                    )}
                    {subtitle && <p className={styles.cardSubtitle} style={{ color: 'var(--admin-text-muted, #334155)' }}>{subtitle}</p>}
                </div>
                {extra && <div>{extra}</div>}
            </div>
        )}
        {children}
    </div>
);

export const AdminInput = (props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        {props.label && (
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary, #2d6a4f)' }}>
                {props.label}
            </label>
        )}
        <input className={styles.input} style={{ backgroundColor: 'var(--admin-input-bg)', color: 'var(--admin-text-main)' }} {...props} />
    </div>
);

export const AdminButton = ({ 
    variant = 'primary', 
    ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) => (
    <button 
        className={`${styles.button} ${styles[variant]}`} 
        {...props} 
    />
);

export const AdminTable = ({ 
    headers, 
    children 
}: { 
    headers: string[], 
    children: React.ReactNode 
}) => (
    <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
            <thead>
                <tr>
                    {headers.map(h => <th key={h} className={styles.th}>{h}</th>)}
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    </div>
);

export const AdminTd = ({ children, align = 'left', bold = false }: { children: React.ReactNode, align?: 'left' | 'right' | 'center', bold?: boolean }) => (
    <td className={styles.td} style={{ textAlign: align, fontWeight: bold ? 700 : 400 }}>
        {children}
    </td>
);
