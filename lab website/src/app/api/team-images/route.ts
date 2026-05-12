import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const MANIFEST_PATH = join(process.cwd(), 'data', 'team-images.json');
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

async function readManifest(): Promise<Record<string, string>> {
    try {
        const data = await readFile(MANIFEST_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeManifest(data: Record<string, string>) {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) await mkdir(dataDir, { recursive: true });
    await writeFile(MANIFEST_PATH, JSON.stringify(data, null, 2));
}

// GET — Return the image manifest { memberKey: '/uploads/filename.ext' }
export async function GET() {
    return NextResponse.json(await readManifest());
}

// POST — Upload an image file for a team member or a generic site section
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const memberKey = formData.get('memberKey') as string;
        const genericId = formData.get('id') as string;
        const file = formData.get('file') as File;

        if ((!memberKey && !genericId) || !file) {
            return NextResponse.json({ error: 'memberKey or id, and a file are required' }, { status: 400 });
        }

        // Use either the memberKey or genericId as the filename base
        const finalKey = memberKey || genericId;

        // Ensure uploads directory exists
        if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });

        // Build a safe filename
        const ext = extname(file.name) || '.jpg';
        const safeKey = finalKey.replace(/[^a-zA-Z0-9-_]/g, '-');
        const filename = `${safeKey}${ext}`;
        const filePath = join(UPLOADS_DIR, filename);

        // Write the file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // ONLY update the team-images manifest if a memberKey was provided
        if (memberKey) {
            const manifest = await readManifest();
            manifest[memberKey] = `/uploads/${filename}`;
            await writeManifest(manifest);
        }

        return NextResponse.json({ path: `/uploads/${filename}` });
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// DELETE — Remove an image for a team member
export async function DELETE(request: NextRequest) {
    try {
        const { memberKey } = await request.json();
        if (!memberKey) {
            return NextResponse.json({ error: 'memberKey is required' }, { status: 400 });
        }

        const manifest = await readManifest();
        const existingPath = manifest[memberKey];

        // Delete the physical file if it exists in our uploads folder
        if (existingPath && existingPath.startsWith('/uploads/')) {
            const filePath = join(process.cwd(), 'public', existingPath);
            if (existsSync(filePath)) {
                await unlink(filePath);
            }
        }

        // Remove from manifest
        delete manifest[memberKey];
        await writeManifest(manifest);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Image delete error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
