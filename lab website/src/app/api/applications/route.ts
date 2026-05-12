import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    await writeFile(APPS_FILE, JSON.stringify(apps, null, 2));
}

// GET — Return all applications
export async function GET() {
    const apps = await readApps();
    return NextResponse.json(apps);
}

// POST — Submit a new application with optional file
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const application: Record<string, any> = {
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };

        // Extract all form fields
        const fields = ['name', 'email', 'city', 'state', 'country', 'institute', 'position', 'period', 'joinDate', 'endDate', 'topic'];
        for (const field of fields) {
            application[field] = formData.get(field) as string || '';
        }

        // Handle file upload
        const file = formData.get('resume') as File | null;
        if (file && file.size > 0) {
            if (!existsSync(UPLOAD_DIR)) {
                await mkdir(UPLOAD_DIR, { recursive: true });
            }
            const ext = file.name.split('.').pop() || 'pdf';
            const safeName = application.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            const filename = `${safeName}-${Date.now()}.${ext}`;
            const filepath = join(UPLOAD_DIR, filename);
            const bytes = await file.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));
            application.resumePath = `/uploads/applications/${filename}`;
            application.resumeFilename = file.name;
        }

        const apps = await readApps();
        apps.push(application);
        await writeApps(apps);

        return NextResponse.json({ success: true, id: application.id });
    } catch (error) {
        console.error('Application submit error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// PUT — Update application status
export async function PUT(request: NextRequest) {
    try {
        const { id, status } = await request.json();
        const apps = await readApps();
        const idx = apps.findIndex((a: any) => a.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        apps[idx].status = status;
        await writeApps(apps);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE — Remove an application
export async function DELETE(request: NextRequest) {
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
