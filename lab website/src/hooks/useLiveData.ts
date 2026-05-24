'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🔄 LIVE DATA HOOK (WITH WEBSOCKETS & POLLING FALLBACK)
 * -----------------
 * Attempts to connect to a WebSocket server for instant, real-time push updates.
 * Falls back to throttled HTTP polling if WebSockets are unreachable or disconnected.
 *
 * OPTIMIZATIONS:
 * - Real-time WebSocket pushes (0s delay for updates).
 * - Automatic HTTP polling fallback (default: 60s) to keep data synchronized.
 * - Pauses HTTP polling when the browser tab is not visible (saves bandwidth).
 * - Automatic WebSocket reconnection with delay.
 */
export function useLiveData<T>(type: string, initialData: T, intervalMs: number = 60000) {
    const [data, setData] = useState<T>(initialData);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async () => {
        // Skip fetching when the tab is in background
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
        // Fetch fresh data immediately on mount
        fetchData();

        // Pause/resume polling on visibility change
        const handleVisibility = () => {
            if (!document.hidden) fetchData();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // WS Connection function
        const connectWS = () => {
            if (typeof window === 'undefined') return;

            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // Connect to local port 3001 in dev, or same domain behind proxy in prod
            const wsUrl = window.location.port === '3000'
                ? `${protocol}//${window.location.hostname}:3001`
                : `${protocol}//${window.location.host}/ws`;

            console.log(`[WS-Client] Connecting to ${wsUrl} for type: ${type}`);
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log(`[WS-Client] Connected successfully for type: ${type}`);
                // Once connected, clear any active HTTP polling to save client/server resources
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === type) {
                        console.log(`[WS-Client] Received real-time update for ${type}:`, msg.data);
                        setData(msg.data);
                    }
                } catch (err) {
                    console.error('[WS-Client] Error parsing message:', err);
                }
            };

            ws.onclose = (event) => {
                console.log(`[WS-Client] Connection closed for type: ${type}. Code: ${event.code}. Reconnecting in 5s...`);
                wsRef.current = null;

                // Start HTTP polling as backup since WebSocket is disconnected
                if (!pollingIntervalRef.current) {
                    pollingIntervalRef.current = setInterval(fetchData, intervalMs);
                }

                // Reconnect attempt
                reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
            };

            ws.onerror = (err) => {
                console.error(`[WS-Client] WebSocket error for type ${type}:`, err);
                ws.close();
            };
        };

        // Start connection
        connectWS();

        // Fallback polling in case WebSocket doesn't connect initially
        pollingIntervalRef.current = setInterval(fetchData, intervalMs);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [type, intervalMs, fetchData]);

    return data;
}
