import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker HEALTHCHECK and monitoring.
 * Returns 200 OK with basic server info.
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}
