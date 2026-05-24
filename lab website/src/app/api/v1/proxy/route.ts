import { NextRequest, NextResponse } from 'next/server';
import { checkGenericRateLimit } from '@/lib/auth';

/**
 * 🔒 SECURE API PROXY ROUTE
 * -------------------------
 * Proxy server to forward requests to external APIs (e.g., PubMed / NCBI E-utilities)
 * without exposing sensitive API keys to the client-side browser bundle.
 */
export async function GET(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    // Rate limit: 20 proxy requests per minute per IP to prevent abuse/DoS
    const rateCheck = checkGenericRateLimit(`proxy-${ip}`, 20, 60 * 1000);
    if (!rateCheck.allowed) {
        const retrySeconds = Math.ceil(rateCheck.retryAfterMs / 1000);
        return NextResponse.json(
            { error: `Rate limit exceeded. Try again in ${retrySeconds} seconds.` },
            { status: 429, headers: { 'Retry-After': String(retrySeconds) } }
        );
    }

    const { searchParams } = request.nextUrl;
    const db = searchParams.get('db') || 'pubmed';
    const term = searchParams.get('term') || '';

    if (!term) {
        return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Server-side only API key (never prefixed with NEXT_PUBLIC_)
    const apiKey = process.env.NCBI_API_KEY || '';

    // Construct external target URL
    const targetUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
    targetUrl.searchParams.set('db', db);
    targetUrl.searchParams.set('term', term);
    targetUrl.searchParams.set('retmode', 'json');
    if (apiKey) {
        targetUrl.searchParams.set('api_key', apiKey);
    }

    try {
        console.log(`[Proxy] Fetching from NCBI for term: ${term}`);
        const res = await fetch(targetUrl.toString());
        if (!res.ok) {
            throw new Error(`NCBI returned status ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('[Proxy] Error fetching from external API:', err);
        return NextResponse.json(
            { error: 'Failed to fetch from external API', details: err.message },
            { status: 500 }
        );
    }
}
