import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { checkGenericRateLimit } from '@/lib/auth';

const DATA_DIR = join(process.cwd(), 'data');

async function readJSON(filename: string): Promise<any> {
    try {
        const data = await readFile(join(DATA_DIR, filename), 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

interface SearchResult {
    type: 'research' | 'facility' | 'goal' | 'publication' | 'session';
    title: string;
    excerpt: string;
    link: string;
}

/**
 * Search API — performs full-text search across all JSON data files.
 * Query parameter: ?q=search+term
 */
export async function GET(request: NextRequest) {
    // Rate limiting: 30 queries per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
    const rateCheck = checkGenericRateLimit(`search-${ip}`, 30, 60 * 1000);

    if (!rateCheck.allowed) {
        const retrySeconds = Math.ceil(rateCheck.retryAfterMs / 1000);
        return NextResponse.json(
            { error: `Too many search queries. Try again in ${retrySeconds} seconds.` },
            { status: 429, headers: { 'Retry-After': String(retrySeconds) } }
        );
    }

    const query = request.nextUrl.searchParams.get('q')?.toLowerCase().trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const results: SearchResult[] = [];

    // Search research areas
    const researchData = await readJSON('admin-research.json');
    const research = Array.isArray(researchData) ? researchData : (researchData?.areas || []);
    if (Array.isArray(research)) {
        for (const item of research) {
            const searchable = `${item.title} ${item.shortDesc} ${item.longDesc || ''}`.toLowerCase();
            if (searchable.includes(query)) {
                results.push({
                    type: 'research',
                    title: item.title,
                    excerpt: item.shortDesc?.substring(0, 100) + '...',
                    link: `/research?topic=${item.id}`,
                });
            }
        }
    }

    // Search facilities
    const facilities = await readJSON('admin-facilities.json');
    if (Array.isArray(facilities)) {
        for (const item of facilities) {
            const searchable = `${item.title} ${item.description} ${item.longDesc || ''}`.toLowerCase();
            if (searchable.includes(query)) {
                results.push({
                    type: 'facility',
                    title: item.title,
                    excerpt: item.description?.substring(0, 100) + '...',
                    link: `/facilities/${item.id}`,
                });
            }
        }
    }

    // Search goals
    const goals = await readJSON('admin-goals.json');
    if (Array.isArray(goals)) {
        for (const item of goals) {
            const searchable = `${item.title} ${item.description} ${item.longDesc || ''}`.toLowerCase();
            if (searchable.includes(query)) {
                results.push({
                    type: 'goal',
                    title: item.title,
                    excerpt: item.description?.substring(0, 100) + '...',
                    link: `/goals/${item.id}`,
                });
            }
        }
    }

    // Search PI publications
    const pi = await readJSON('admin-pi.json');
    if (pi?.publications) {
        for (const pub of pi.publications) {
            if (pub.title?.toLowerCase().includes(query)) {
                results.push({
                    type: 'publication',
                    title: pub.title,
                    excerpt: pub.link ? `Link: ${pub.link}` : 'No link available',
                    link: pub.link || '/#pi',
                });
            }
        }
    }

    // Search sessions
    const sessions = await readJSON('admin-sessions.json');
    if (sessions?.presenters) {
        for (const p of sessions.presenters) {
            const searchable = `${p.presenter} ${p.topic}`.toLowerCase();
            if (searchable.includes(query)) {
                results.push({
                    type: 'session',
                    title: p.topic,
                    excerpt: `Presenter: ${p.presenter} • ${p.time || 'Time TBD'}`,
                    link: '/#progress',
                });
            }
        }
    }

    return NextResponse.json({ results: results.slice(0, 20) });
}
