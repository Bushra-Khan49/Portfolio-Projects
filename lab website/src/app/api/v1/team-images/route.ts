import { NextRequest, NextResponse } from 'next/server';
import { extname } from 'path';
import { requireAdmin } from '@/lib/auth';
import { readDataJSON, writeDataJSON, uploadFileBuffer, deleteFile } from '@/lib/db';

async function readManifest(): Promise<Record<string, string>> {
    return await readDataJSON('team-images', {});
}

async function writeManifest(data: Record<string, string>) {
    await writeDataJSON('team-images', data);
}

// GET — Return the image manifest { memberKey: '/uploads/filename.ext' }
export async function GET() {
    return NextResponse.json(await readManifest());
}

// POST — Upload an image file for a team member or a generic site section (requires admin authentication)
export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const formData = await request.formData();
        const memberKey = formData.get('memberKey') as string;
        const genericId = formData.get('id') as string;
        const file = formData.get('file') as File;

        if ((!memberKey && !genericId) || !file) {
            return NextResponse.json({ error: 'memberKey or id, and a file are required' }, { status: 400 });
        }

        // File size limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
        }

        // Image extension and MIME type validation
        const fileExt = extname(file.name).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
        const allowedMimetypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

        if (!allowedExtensions.includes(fileExt) || !allowedMimetypes.includes(file.type)) {
            return NextResponse.json({ 
                error: 'Invalid file type. Only PNG, JPG, JPEG, WEBP, and GIF images are allowed.' 
            }, { status: 400 });
        }

        // Use either the memberKey or genericId as the filename base
        const finalKey = memberKey || genericId;

        // Build a safe filename (strips any path traversal elements)
        const safeKey = finalKey.replace(/[^a-zA-Z0-9-_]/g, '-');
        const filename = `${safeKey}${fileExt}`;

        // Write the file
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadedUrl = await uploadFileBuffer(
            buffer,
            `team-images/${filename}`,
            file.type
        );

        // ONLY update the team-images manifest if a memberKey was provided
        if (memberKey) {
            const manifest = await readManifest();
            manifest[memberKey] = uploadedUrl;
            await writeManifest(manifest);
        }

        return NextResponse.json({ path: uploadedUrl });
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// DELETE — Remove an image for a team member (requires admin authentication)
export async function DELETE(request: NextRequest) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const { memberKey } = await request.json();
        if (!memberKey) {
            return NextResponse.json({ error: 'memberKey is required' }, { status: 400 });
        }

        const manifest = await readManifest();
        const existingPath = manifest[memberKey];

        // Delete the physical file / object from database storage
        if (existingPath) {
            await deleteFile(existingPath);
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
