import { NextRequest, NextResponse } from 'next/server';
import {
    hashPassword,
    verifyPassword,
    isHashed,
    generateToken,
    setAuthCookie,
    clearAuthCookie,
    getAuthFromRequest,
    checkRateLimit,
} from '@/lib/auth';
import { readDataJSON, writeDataJSON } from '@/lib/db';

/**
 * Read admin credentials from the settings store.
 * On first access, migrates plaintext passwords to bcrypt hashes.
 */
async function getCredentials(): Promise<{ adminId: string; passwordHash: string }> {
    const defaultId = 'Admin ID';
    const defaultHash = await hashPassword('Password');
    const defaultSettings = { adminId: defaultId, password: defaultHash };

    try {
        const parsed = await readDataJSON('settings', defaultSettings);

        if (parsed && parsed.adminId && parsed.password) {
            // Migrate plaintext password to hash if needed
            if (!isHashed(parsed.password)) {
                const hashed = await hashPassword(parsed.password);
                parsed.password = hashed;
                await writeDataJSON('settings', parsed);
                return { adminId: parsed.adminId, passwordHash: hashed };
            }
            return { adminId: parsed.adminId, passwordHash: parsed.password };
        }
    } catch (err) {
        console.error('[AUTH] Failed to get credentials from DB, returning defaults:', err);
    }

    return { adminId: defaultId, passwordHash: defaultHash };
}

/**
 * POST /api/auth — Login endpoint.
 * Validates credentials server-side, sets httpOnly JWT cookie on success.
 * Rate-limited to 5 attempts per IP per 15 minutes.
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';
        const rateCheck = checkRateLimit(ip);

        if (!rateCheck.allowed) {
            const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60000);
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${retryMinutes} minute(s).` },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) } }
            );
        }

        const { adminId, password } = await request.json();

        if (!adminId || !password) {
            return NextResponse.json({ error: 'Credentials required' }, { status: 400 });
        }

        const creds = await getCredentials();

        // Validate credentials using bcrypt
        if (adminId === creds.adminId && await verifyPassword(password, creds.passwordHash)) {
            const token = generateToken(adminId);
            await setAuthCookie(token);
            return NextResponse.json({ authenticated: true });
        }

        // Simulate network delay to discourage brute-force
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json(
            { error: 'Invalid credentials', remaining: rateCheck.remaining },
            { status: 401 }
        );
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/**
 * GET /api/auth — Verify current session.
 * Returns { authenticated: true } if the JWT cookie is valid.
 */
export async function GET() {
    const auth = await getAuthFromRequest();
    if (auth) {
        return NextResponse.json({ authenticated: true, adminId: auth.adminId });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
}

/**
 * DELETE /api/auth — Logout endpoint.
 * Clears the httpOnly JWT cookie.
 */
export async function DELETE() {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
}
