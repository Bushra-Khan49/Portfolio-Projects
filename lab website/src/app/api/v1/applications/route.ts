import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireAdmin, checkGenericRateLimit } from '@/lib/auth';

const DATA_DIR = join(process.cwd(), 'data');
const APPS_FILE = join(DATA_DIR, 'applications.json');
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'applications');

async function readApps(): Promise<any[]> {
    try {
        const data = await readFile(APPS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeApps(apps: any[]) {
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${APPS_FILE}.tmp`;
    await writeFile(tempFile, JSON.stringify(apps, null, 2));
    await rename(tempFile, APPS_FILE);
}

function sanitizeInput(val: string): string {
    return val.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

// GET — Return all applications (requires admin authentication)
export async function GET(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const apps = await readApps();
    return NextResponse.json(apps);
}

// POST — Submit a new application with optional file
export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 5 attempts per 15 minutes per IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';
        const rateCheck = checkGenericRateLimit(`apps-${ip}`, 5, 15 * 60 * 1000);

        if (!rateCheck.allowed) {
            const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60000);
            return NextResponse.json(
                { error: `Too many applications submitted. Try again in ${retryMinutes} minute(s).` },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) } }
            );
        }

        const formData = await request.formData();

        const application: Record<string, any> = {
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };

        // Extract and sanitize all form fields
        const fields = ['name', 'email', 'city', 'state', 'country', 'institute', 'position', 'period', 'joinDate', 'endDate', 'topic'];
        for (const field of fields) {
            const rawVal = formData.get(field) as string || '';
            application[field] = sanitizeInput(rawVal);
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(application.email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Handle file upload
        const file = formData.get('resume') as File | null;
        if (file && file.size > 0) {
            // Size limit: 5MB
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
            }

            // Extension and MIME type validation
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const allowedExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
            const allowedMimetypes = [
                'application/pdf',
                'image/png',
                'image/jpeg',
                'image/jpg',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (!fileExt || !allowedExtensions.includes(fileExt) || !allowedMimetypes.includes(file.type)) {
                return NextResponse.json({ 
                    error: 'Invalid file type. Only PDF, DOC, DOCX, PNG, and JPG/JPEG files are allowed.' 
                }, { status: 400 });
            }

            if (!existsSync(UPLOAD_DIR)) {
                await mkdir(UPLOAD_DIR, { recursive: true });
            }

            // Generate safe filename to prevent path traversal
            const safeName = application.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'resume';
            const filename = `${safeName}-${Date.now()}.${fileExt}`;
            const filepath = join(UPLOAD_DIR, filename);

            const bytes = await file.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));
            application.resumePath = `/uploads/applications/${filename}`;
            application.resumeFilename = sanitizeInput(file.name);
        }

        const apps = await readApps();
        apps.push(application);
        await writeApps(apps);

        return NextResponse.json({ success: true, id: application.id });
    } catch (error) {
        console.error('Application submit error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// PUT — Update application status (requires admin authentication)
export async function PUT(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const { id, status } = await request.json();
        const apps = await readApps();
        const idx = apps.findIndex((a: any) => a.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        apps[idx].status = sanitizeInput(status);
        await writeApps(apps);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE — Remove an application (requires admin authentication)
export async function DELETE(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const { id } = await request.json();
        let apps = await readApps();
        apps = apps.filter((a: any) => a.id !== id);
        await writeApps(apps);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
