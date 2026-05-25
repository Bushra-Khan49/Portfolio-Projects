import { readFile, writeFile, mkdir, rename, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DATA_DIR = join(process.cwd(), 'data');
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

// Map keys to filenames for local fallback
const FILE_MAP: Record<string, string> = {
    sessions: 'admin-sessions.json',
    team: 'admin-team.json',
    pi: 'admin-pi.json',
    research: 'admin-research.json',
    facilities: 'admin-facilities.json',
    goals: 'admin-goals.json',
    settings: 'admin-settings.json',
    about: 'admin-about.json',
    applications: 'applications.json',
    'team-images': 'team-images.json'
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        console.log('[DB] Supabase client initialized in dual-mode (Cloud Mode active)');
    } catch (err) {
        console.error('[DB] Failed to initialize Supabase client:', err);
    }
} else {
    console.log('[DB] Supabase environment variables not set. (Local Filesystem Mode active)');
}

/**
 * Reads JSON data for a given key.
 * In cloud mode, queries the supabase 'cms_data' table.
 * In local mode, reads the mapping file from '/data/*.json'.
 */
export async function readDataJSON(key: string, defaultVal: any): Promise<any> {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('cms_data')
                .select('data')
                .eq('key', key)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Row not found, write default and return it
                    console.log(`[DB] Key "${key}" not found in Supabase. Initializing default...`);
                    await writeDataJSON(key, defaultVal);
                    return defaultVal;
                }
                throw error;
            }
            return data.data;
        } catch (err) {
            console.error(`[DB] Error reading key "${key}" from Supabase:`, err);
            // Fallback to local files if database read fails in runtime
        }
    }

    // Local Fallback Mode
    const filename = FILE_MAP[key];
    if (!filename) {
        throw new Error(`[DB] Unknown database key: ${key}`);
    }

    try {
        const filePath = join(DATA_DIR, filename);
        if (!existsSync(filePath)) {
            if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
            await writeFile(filePath, JSON.stringify(defaultVal, null, 2));
            return defaultVal;
        }
        const fileContent = await readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.error(`[DB] Local read failed for key "${key}":`, err);
        return defaultVal;
    }
}

// Lock map to serialize local file writes
const fileLocks = new Map<string, Promise<void>>();

/**
 * Writes JSON data for a given key.
 * In cloud mode, upserts to the supabase 'cms_data' table.
 * In local mode, performs atomic writes to '/data/*.json'.
 */
export async function writeDataJSON(key: string, data: any): Promise<void> {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('cms_data')
                .upsert({ key, data, updated_at: new Date().toISOString() });

            if (error) throw error;
            return;
        } catch (err) {
            console.error(`[DB] Error writing key "${key}" to Supabase:`, err);
            throw err;
        }
    }

    // Local Fallback Mode
    const filename = FILE_MAP[key];
    if (!filename) {
        throw new Error(`[DB] Unknown database key: ${key}`);
    }

    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    const targetPath = join(DATA_DIR, filename);
    const tempPath = `${targetPath}.tmp`;

    const existingPromise = fileLocks.get(filename) || Promise.resolve();
    const nextPromise = existingPromise.then(async () => {
        await writeFile(tempPath, JSON.stringify(data, null, 2));
        await rename(tempPath, targetPath);
    }).catch(err => {
        console.error(`[DB] Local write collision for ${filename}:`, err);
        throw err;
    });

    fileLocks.set(filename, nextPromise);
    await nextPromise;
}

/**
 * Uploads a file buffer.
 * In cloud mode, uploads to Supabase Storage bucket 'uploads'.
 * In local mode, writes to 'public/uploads/[relativePath]'.
 * @returns The public URL of the uploaded file
 */
export async function uploadFileBuffer(
    fileBuffer: Buffer,
    relativePath: string,
    mimeType: string
): Promise<string> {
    // Sanitize relativePath to prevent directory traversal
    const cleanPath = relativePath.replace(/\.\./g, '').replace(/\\/g, '/');

    if (supabase) {
        try {
            // Upload to the 'uploads' bucket
            const { error } = await supabase.storage
                .from('uploads')
                .upload(cleanPath, fileBuffer, {
                    contentType: mimeType,
                    upsert: true
                });

            if (error) throw error;

            // Get public URL
            const { data } = supabase.storage
                .from('uploads')
                .getPublicUrl(cleanPath);

            return data.publicUrl;
        } catch (err) {
            console.error(`[DB] Supabase file upload failed for "${cleanPath}":`, err);
            throw err;
        }
    }

    // Local Fallback Mode
    const filePath = join(UPLOADS_DIR, cleanPath);
    const parentDir = join(filePath, '..');

    if (!existsSync(parentDir)) {
        await mkdir(parentDir, { recursive: true });
    }

    await writeFile(filePath, fileBuffer);
    return `/uploads/${cleanPath}`;
}

/**
 * Deletes a file.
 * In cloud mode, removes from the Supabase bucket.
 * In local mode, deletes from the 'public/uploads/' directory.
 */
export async function deleteFile(pathOrUrl: string): Promise<void> {
    if (supabase) {
        try {
            // Extract the relative path from the public URL if necessary
            let relativePath = pathOrUrl;
            if (pathOrUrl.startsWith('http')) {
                // E.g., https://dvkisekybbihsnmnktiz.supabase.co/storage/v1/object/public/uploads/team-images/avatar.png
                // We extract the part after '/uploads/'
                const urlParts = pathOrUrl.split('/uploads/');
                if (urlParts.length > 1) {
                    relativePath = urlParts[1];
                }
            }

            const { error } = await supabase.storage
                .from('uploads')
                .remove([relativePath]);

            if (error) throw error;
            return;
        } catch (err) {
            console.error(`[DB] Supabase file deletion failed for "${pathOrUrl}":`, err);
        }
    }

    // Local Fallback Mode
    let localPath = pathOrUrl;
    if (pathOrUrl.startsWith('/uploads/')) {
        localPath = pathOrUrl.substring('/uploads/'.length);
    } else if (pathOrUrl.startsWith('http')) {
        // If it was stored as public URL but we are now in local mode (unlikely but safe check)
        const urlParts = pathOrUrl.split('/uploads/');
        if (urlParts.length > 1) {
            localPath = urlParts[1];
        }
    }

    try {
        const filePath = join(UPLOADS_DIR, localPath);
        if (existsSync(filePath)) {
            await unlink(filePath);
        }
    } catch (err) {
        console.error(`[DB] Local file deletion failed for "${pathOrUrl}":`, err);
    }
}
