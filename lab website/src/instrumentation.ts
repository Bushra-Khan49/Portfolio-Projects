export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { wsManager } = await import('./lib/ws');
        const port = parseInt(process.env.WS_PORT || '3001', 10);
        wsManager.init(port);
    }
}
