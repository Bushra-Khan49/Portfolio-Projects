/**
 * 🔐 AUTH LIBRARY
 * ---------------
 * Centralized authentication utilities for the Nexus Genomics Institute platform.
 *
 * FEATURES:
 * - JWT token generation & verification (httpOnly cookies)
 * - Password hashing with bcrypt (10 salt rounds)
 * - In-memory rate limiting (5 attempts per 15 minutes per IP)
 * - CSRF origin validation
 *
 * DESIGN DECISIONS:
 * - JWT secret is generated once at startup and stored in-memory.
 *   For multi-instance deployments, move to an env var (JWT_SECRET).
 * - Rate limiter uses a Map; resets on server restart. For production
 *   at scale, consider Redis-backed limiting.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ─── JWT Configuration ───────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'ngi-admin-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
const JWT_EXPIRY = '8h';
const COOKIE_NAME = 'ngi_admin_token';

// ─── Password Hashing ───────────────────────────────────────
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Check if a password string is already a bcrypt hash.
 * Bcrypt hashes always start with "$2a$", "$2b$", or "$2y$".
 */
export function isHashed(value: string): boolean {
    return /^\$2[aby]\$\d{2}\$/.test(value);
}

// ─── JWT Token Management ───────────────────────────────────

export function generateToken(adminId: string): string {
    return jwt.sign({ adminId, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): { adminId: string; role: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { adminId: string; role: string };
    } catch {
        return null;
    }
}

/**
 * Set the admin auth cookie (httpOnly, secure in production).
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/',
    });
}

/**
 * Clear the admin auth cookie (on sign-out).
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Get and validate the admin token from the request cookies.
 * Returns the decoded payload or null if invalid/missing.
 */
export async function getAuthFromRequest(): Promise<{ adminId: string; role: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

// ─── Rate Limiting ──────────────────────────────────────────

interface RateLimitEntry {
    count: number;
    firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if an IP has exceeded the rate limit for login attempts.
 * Returns { allowed: boolean, remaining: number, retryAfterMs: number }.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // No previous attempts
    if (!entry) {
        rateLimitMap.set(ip, { count: 1, firstAttempt: now });
        return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
    }

    // Window expired — reset
    if (now - entry.firstAttempt > WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, firstAttempt: now });
        return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
    }

    // Within window
    if (entry.count >= MAX_ATTEMPTS) {
        const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
        return { allowed: false, remaining: 0, retryAfterMs };
    }

    entry.count++;
    return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, retryAfterMs: 0 };
}

// Clean up stale entries every 30 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
        if (now - entry.firstAttempt > WINDOW_MS) {
            rateLimitMap.delete(ip);
        }
    }
}, 30 * 60 * 1000);

// ─── CSRF Validation ────────────────────────────────────────

/**
 * Validates that the request origin matches the expected host.
 * Returns true if the request is safe, false if it should be rejected.
 */
export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow requests with no origin (same-origin API calls, server-side)
    if (!origin) return true;

    // Extract hostname from origin
    try {
        const originHost = new URL(origin).host;
        return originHost === host;
    } catch {
        return false;
    }
}

/**
 * Middleware helper: checks auth + CSRF for admin mutation endpoints.
 * Returns a NextResponse error if unauthorized, or null if OK.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
    // CSRF check
    if (!validateOrigin(request)) {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    // Auth check
    const auth = await getAuthFromRequest();
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized — please log in' }, { status: 401 });
    }

    return null; // All good
}
