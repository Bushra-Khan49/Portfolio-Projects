const { readFile } = require('fs/promises');
const { join } = require('path');
const { existsSync } = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const DATA_DIR = join(process.cwd(), 'data');

const FILE_MAP = {
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

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in your .env.local file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    console.log('⚡ Starting Supabase setup and migration...');

    // 1. Setup Storage Bucket
    try {
        console.log('📦 Setting up Supabase Storage bucket "uploads"...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) throw listError;

        const bucketExists = buckets.some(b => b.name === 'uploads');
        if (!bucketExists) {
            console.log('➕ Bucket "uploads" does not exist. Creating it...');
            const { error: createError } = await supabase.storage.createBucket('uploads', {
                public: true,
                allowedMimeTypes: [
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/webp',
                    'image/gif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ],
                fileSizeLimit: 5 * 1024 * 1024 // 5MB
            });
            if (createError) throw createError;
            console.log('✅ Bucket "uploads" created successfully.');
        } else {
            console.log('✅ Bucket "uploads" already exists.');
        }
    } catch (err) {
        console.error('❌ Failed to setup storage bucket:', err.message || err);
    }

    // 2. Migrate JSON Datasets to the 'cms_data' table
    console.log('\n📊 Migrating local data files...');
    for (const [key, filename] of Object.entries(FILE_MAP)) {
        const filePath = join(DATA_DIR, filename);
        if (!existsSync(filePath)) {
            console.log(`⚠️ Skip: Local file "${filename}" not found. No data to migrate for key "${key}".`);
            continue;
        }

        try {
            const content = await readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            console.log(`⏳ Uploading data for key "${key}" (${filename})...`);

            const { error: upsertError } = await supabase
                .from('cms_data')
                .upsert({
                    key,
                    data,
                    updated_at: new Date().toISOString()
                });

            if (upsertError) throw upsertError;
            console.log(`✅ Successfully migrated key "${key}".`);
        } catch (err) {
            console.error(`❌ Failed to migrate key "${key}":`, err.message || err);
        }
    }

    console.log('\n✨ Setup and migration completed successfully!');
}

run().catch(err => {
    console.error('Fatal Migration Error:', err);
    process.exit(1);
});
