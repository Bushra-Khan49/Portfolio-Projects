'use client';

import { useState, useEffect } from 'react';

export function useLiveData<T>(type: string, initialData: T, intervalMs: number = 3000) {
    const [data, setData] = useState<T>(initialData);

    useEffect(() => {
        // Initial fetch
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin-data?type=${type}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error(`LiveSync Error [${type}]:`, err);
            }
        };

        fetchData();

        // Polling interval
        const interval = setInterval(fetchData, intervalMs);
        return () => clearInterval(interval);
    }, [type, intervalMs]);

    return data;
}
