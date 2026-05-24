'use client';

import { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JoinLabPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successToast, setSuccessToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        state: '',
        country: '',
        institute: '',
        position: '',
        period: '3 Months',
        joinDate: '',
        endDate: '',
        topic: ''
    });

    // Structural Error State
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters.';

        // Valid Email Regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid institutional email.';
        }

        if (!formData.city) newErrors.city = 'City is required.';
        if (!formData.state) newErrors.state = 'State is required.';
        if (!formData.country) newErrors.country = 'Country is required.';
        if (!formData.institute) newErrors.institute = 'Institute is required.';
        if (!formData.position) newErrors.position = 'Position is required.';

        // Basic Date Logic Check
        if (formData.joinDate && formData.endDate) {
            if (new Date(formData.endDate) <= new Date(formData.joinDate)) {
                newErrors.endDate = 'Ending date must be after joining date.';
            }
        }

        if (!formData.topic) newErrors.topic = 'Research topic is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrorToast(false);

        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
            if (selectedFile) {
                fd.append('resume', selectedFile);
            }

            const res = await fetch('/api/v1/applications', {
                method: 'POST',
                body: fd,
            });

            if (!res.ok) throw new Error('Submission failed');

            setIsSubmitting(false);
            setSuccessToast(true);
            setSelectedFile(null);
            setFormData({
                name: '', email: '', city: '', state: '', country: '',
                institute: '', position: '', period: '3 Months',
                joinDate: '', endDate: '', topic: ''
            });
            setTimeout(() => setSuccessToast(false), 4000);
        } catch {
            setIsSubmitting(false);
            setErrorToast(true);
        }
    };

    const handleFileChange = (file: File) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, resume: 'File must be less than 10MB.' }));
            return;
        }
        setSelectedFile(file);
        setErrors(prev => { const n = { ...prev }; delete n.resume; return n; });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    return (
        <main style={{ backgroundColor: 'var(--color-bg-gray)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Navigation />

            {/* API Loading Global Blur Overlay */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                            <p style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Submitting your application...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {successToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        className="toast toast-success"
                    >
                        <CheckCircle2 color="#30A46C" />
                        <span>Application successfully submitted. We will contact you via email.</span>
                        <button onClick={() => setSuccessToast(false)}><X size={16} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* API Failure Toast */}
            <AnimatePresence>
                {errorToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0 }}
                        className="toast toast-error"
                    >
                        <AlertCircle color="#E5484D" />
                        <span>Submission failed. Please try again.</span>
                        <button onClick={() => setErrorToast(false)}><X size={16} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '8rem', paddingBottom: '4rem', zIndex: 10 }}>

                <div className="glass-card" style={{ padding: '3.5rem', width: '100%', maxWidth: '800px', backgroundColor: '#e8f5e9', '--color-text-main': '#000000', '--color-text-muted': '#2d6a4f' } as React.CSSProperties}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>Join the Lab</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Submit your application to join Nexus Genomics Institute.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', position: 'relative' }}>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name *</label>
                            <input
                                type="text" id="name" required
                                className={`form-input focus-elevate ${errors.name ? 'input-error' : ''}`}
                                disabled={isSubmitting}
                                placeholder="e.g. Alice Vance"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && <span className="error-text"><AlertCircle size={14} />{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Institutional Email *</label>
                            <input
                                type="email" id="email" required
                                className={`form-input focus-elevate ${errors.email ? 'input-error' : ''}`}
                                disabled={isSubmitting}
                                placeholder="e.g. alice.vance@university.edu"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <span className="error-text"><AlertCircle size={14} />{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="city" className="form-label">City *</label>
                            <input type="text" id="city" className={`form-input focus-elevate ${errors.city ? 'input-error' : ''}`} required disabled={isSubmitting}
                                placeholder="e.g. Horizon City"
                                value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            {errors.city && <span className="error-text"><AlertCircle size={14} />{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="state" className="form-label">State *</label>
                            <input type="text" id="state" className={`form-input focus-elevate ${errors.state ? 'input-error' : ''}`} required disabled={isSubmitting}
                                placeholder="e.g. California"
                                value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            {errors.state && <span className="error-text"><AlertCircle size={14} />{errors.state}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="country" className="form-label">Country *</label>
                            <input type="text" id="country" className={`form-input focus-elevate ${errors.country ? 'input-error' : ''}`} required disabled={isSubmitting}
                                placeholder="e.g. USA"
                                value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                            {errors.country && <span className="error-text"><AlertCircle size={14} />{errors.country}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="institute" className="form-label">Current Institute *</label>
                            <input type="text" id="institute" className={`form-input focus-elevate ${errors.institute ? 'input-error' : ''}`} required disabled={isSubmitting}
                                placeholder="e.g. University of Horizon"
                                value={formData.institute} onChange={e => setFormData({ ...formData, institute: e.target.value })} />
                            {errors.institute && <span className="error-text"><AlertCircle size={14} />{errors.institute}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="position" className="form-label">Work Position *</label>
                            <input type="text" id="position" className={`form-input focus-elevate ${errors.position ? 'input-error' : ''}`} required placeholder="e.g., PhD Student, Postdoc, etc." disabled={isSubmitting}
                                value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                            {errors.position && <span className="error-text"><AlertCircle size={14} />{errors.position}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="period" className="form-label">Work Period *</label>
                            <select id="period" className="form-select focus-elevate" required disabled={isSubmitting}
                                value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })}>
                                <option value="1 Month">1 Month</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="Full Time">Full Time</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="joinDate" className="form-label">Joining Date *</label>
                            <input
                                type="date" id="joinDate" required
                                className={`form-input focus-elevate ${errors.joinDate ? 'input-error' : ''}`}
                                disabled={isSubmitting}
                                value={formData.joinDate} onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate" className="form-label">Ending Date *</label>
                            <input
                                type="date" id="endDate" required
                                className={`form-input focus-elevate ${errors.endDate ? 'input-error' : ''}`}
                                disabled={isSubmitting}
                                value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                            {errors.endDate && <span className="error-text"><AlertCircle size={14} />{errors.endDate}</span>}
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="topic" className="form-label">Previous Research Topic *</label>
                            <textarea id="topic" className={`form-textarea focus-elevate ${errors.topic ? 'input-error' : ''}`} rows={4} required placeholder="Describe your previous research work..." disabled={isSubmitting}
                                value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} />
                            {errors.topic && <span className="error-text"><AlertCircle size={14} />{errors.topic}</span>}
                        </div>

                        {/* File Upload with drag-and-drop */}
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
                            <label htmlFor="resume" className="form-label">Upload CV/Resume</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="resume"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileChange(file);
                                }}
                            />
                            <div
                                className="upload-box"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                style={{
                                    pointerEvents: isSubmitting ? 'none' : 'auto',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    cursor: 'pointer',
                                    borderColor: isDragging ? 'var(--color-primary)' : selectedFile ? '#059669' : undefined,
                                    backgroundColor: isDragging ? 'rgba(85,81,255,0.05)' : selectedFile ? 'rgba(5,150,105,0.05)' : undefined,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {selectedFile ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FileText size={28} style={{ color: '#059669' }} />
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedFile.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginLeft: '0.5rem', fontSize: '0.8rem' }}>Remove</button>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ margin: '0 auto 1rem auto', color: isDragging ? 'var(--color-primary)' : 'var(--color-primary)' }} />
                                        <p>{isDragging ? 'Drop your file here' : 'Drag and drop your file here or click to browse'}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>PDF, DOC, DOCX, JPG, PNG • Max 10MB</p>
                                    </>
                                )}
                            </div>
                            {errors.resume && <span className="error-text"><AlertCircle size={14} />{errors.resume}</span>}
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                            <button type="button" className="btn btn-outline" onClick={() => window.history.back()} disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                                {isSubmitting ? <><Loader2 className="spinner" size={16} /> Submitting...</> : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
