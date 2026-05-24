'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 🔄 LIVE DATA HOOK
 * -----------------
 * Polls the admin-data API at a configurable interval for real-time content sync.
 *
 * OPTIMIZATIONS:
 * - Default interval is 60s for public pages (was 3s — 95% reduction in API calls).
 * - Pauses polling when the browser tab is not visible (saves bandwidth).
 * - Admin pages can pass a shorter interval (e.g. 10000ms) for faster preview.
 */
export function useLiveData<T>(type: string, initialData: T, intervalMs: number = 60000) {
    const [data, setData] = useState<T>(initialData);

    const fetchData = useCallback(async () => {
        // Skip polling when the tab is in background
        if (document.hidden) return;

        try {
            const res = await fetch(`/api/v1/admin-data?type=${type}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(`LiveSync Error [${type}]:`, err);
        }
    }, [type]);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Polling interval
        const interval = setInterval(fetchData, intervalMs);

        // Pause/resume on visibility change
        const handleVisibility = () => {
            if (!document.hidden) fetchData();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [type, intervalMs, fetchData]);

    return data;
}
