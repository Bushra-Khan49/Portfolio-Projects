import { WebSocketServer, WebSocket } from 'ws';

class WebSocketManager {
    private wss: WebSocketServer | null = null;
    private clients: Set<WebSocket> = new Set();

    init(port: number) {
        // Prevent running on client-side compilation
        if (typeof window !== 'undefined') return;
        if (this.wss) {
            console.log('[WS] WebSocket server already initialized.');
            return;
        }

        console.log(`[WS] Initializing WebSocket server on port ${port}...`);
        try {
            this.wss = new WebSocketServer({ port });
            
            this.wss.on('connection', (ws) => {
                this.clients.add(ws);
                console.log(`[WS] Client connected. Total active connections: ${this.clients.size}`);
                
                ws.on('close', () => {
                    this.clients.delete(ws);
                    console.log(`[WS] Client disconnected. Total active connections: ${this.clients.size}`);
                });

                ws.on('error', (err) => {
                    console.error('[WS] Client connection error:', err);
                });
            });

            this.wss.on('error', (err) => {
                console.error('[WS] WebSocket server error:', err);
            });
        } catch (err) {
            console.error('[WS] Failed to start WebSocket server:', err);
        }
    }

    broadcast(type: string, data: any) {
        if (!this.wss) {
            console.log('[WS] WebSocket server not initialized. Cannot broadcast.');
            return;
        }
        const payload = JSON.stringify({ type, data });
        console.log(`[WS] Broadcasting update for '${type}' to ${this.clients.size} clients`);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        }
    }
}

// Attach the manager to globalThis to prevent multiple server instances in development hot-reloading
const globalForWs = globalThis as unknown as { wsManager: WebSocketManager };
export const wsManager = globalForWs.wsManager || new WebSocketManager();
if (process.env.NODE_ENV !== 'production') globalForWs.wsManager = wsManager;
