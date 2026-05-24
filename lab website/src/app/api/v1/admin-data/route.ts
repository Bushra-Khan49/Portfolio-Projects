import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { revalidatePath } from 'next/cache';
import { requireAdmin, hashPassword, isHashed } from '@/lib/auth';

/**
 * 🛰️ ADMIN DATA API (THE BRAIN)
 * ----------------------------
 * This is a RESTful API route for persistent storage management.
 * 
 * WHY JSON?
 * - No external Database-as-a-Service is required.
 * - Files are saved directly to the /data repository.
 * - Fast, cheap, and easily portable (local-first architecture).
 * 
 * OPERATIONS:
 * - GET: Reads from data/*.json based on the 'type' query param.
 * - POST: Overwrites or Updates a JSON file with safe write handling.
 */

const DATA_DIR = join(process.cwd(), 'data');

async function readJSON(filename: string): Promise<any> {
    try {
        const data = await readFile(join(DATA_DIR, filename), 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

import { z } from 'zod';

const fileLocks = new Map<string, Promise<void>>();

async function writeJSON(filename: string, data: any) {
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    const targetPath = join(DATA_DIR, filename);
    const tempPath = `${targetPath}.tmp`;

    // Queue up writes to the same file to prevent concurrency collisions
    const existingPromise = fileLocks.get(filename) || Promise.resolve();
    const nextPromise = existingPromise.then(async () => {
        await writeFile(tempPath, JSON.stringify(data, null, 2));
        await rename(tempPath, targetPath);
    }).catch(err => {
        console.error(`Concurrency write error for ${filename}:`, err);
    });

    fileLocks.set(filename, nextPromise);
    await nextPromise;
}

const schemas: Record<string, z.ZodType<any>> = {
    sessions: z.object({
        meeting: z.object({
            title: z.string(),
            number: z.string(),
            purpose: z.string(),
            date: z.string(),
            time: z.string(),
            location: z.string(),
        }),
        presenters: z.array(z.object({
            id: z.string(),
            presenter: z.string(),
            topic: z.string(),
            time: z.string(),
            status: z.string()
        })),
        history: z.array(z.any()).optional()
    }),
    team: z.object({
        phdScholars: z.array(z.object({ id: z.string(), name: z.string(), role: z.string().optional() })),
        researchAssociates: z.array(z.object({ id: z.string(), name: z.string(), role: z.string().optional() })),
        interns: z.array(z.object({ id: z.string(), name: z.string(), role: z.string().optional() }))
    }),
    pi: z.object({
        name: z.string(),
        role: z.string(),
        affiliation: z.string(),
        email: z.string(),
        altEmail: z.string(),
        location: z.string(),
        quote: z.string(),
        featuredPublication: z.string(),
        publications: z.array(z.object({ id: z.string(), title: z.string(), link: z.string().optional().nullable() }))
    }),
    research: z.object({
        pageTitle: z.string(),
        pageSubtitle: z.string(),
        sidebarLabel: z.string(),
        areas: z.array(z.object({
            id: z.string(),
            title: z.string(),
            shortDesc: z.string(),
            longDesc: z.string().optional(),
            image: z.string()
        }))
    }),
    facilities: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        longDesc: z.string(),
        stats: z.array(z.object({ label: z.string(), value: z.string() })),
        image: z.string()
    })),
    goals: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        longDesc: z.string(),
        progress: z.number(),
        target: z.string(),
        image: z.string(),
        breakdown: z.array(z.object({
            label: z.string(),
            plan: z.string(),
            achieved: z.string(),
            remaining: z.string(),
            desc: z.string(),
            lastUpdated: z.string().optional(),
            details: z.string().optional()
        }))
    })),
    settings: z.object({
        adminId: z.string(),
        password: z.string().optional()
    }),
    about: z.object({
        speech: z.object({ title: z.string(), content: z.string(), author: z.string(), designation: z.string() }),
        mission: z.object({ title: z.string(), content: z.string() }),
        vision: z.object({ title: z.string(), content: z.string() }),
        history: z.array(z.object({ year: z.string(), event: z.string() })),
        social: z.object({ whatsapp: z.string(), email: z.string(), linkedin: z.string(), twitter: z.string() })
    })
};

// Default data structures
function getDefaults(type: string) {
    if (type === 'sessions') {
        return {
            meeting: {
                title: 'Lab Meeting',
                number: '1st',
                purpose: 'Weekly research presentations and discussion',
                date: '2026-04-15',
                time: '10:00',
                location: 'Building 4, Wing B',
            },
            presenters: [
                { id: '1', presenter: 'Alice Vance', topic: 'Predictive modeling of secondary metabolite pathways', time: '11:00 AM', status: 'scheduled' },
                { id: '2', presenter: 'Clara Oswald', topic: 'Multi-omics integration architectures', time: '1:30 PM', status: 'scheduled' },
                { id: '3', presenter: 'Diana Prince', topic: 'High-throughput annotation pipelines', time: '3:00 PM', status: 'scheduled' },
            ],
            history: [],
        };
    }
    if (type === 'team') {
        return {
            phdScholars: [
                { id: '1', name: 'Alice Vance', role: 'PhD Scholar' },
                { id: '2', name: 'Clara Oswald', role: 'PhD Scholar' },
                { id: '3', name: 'Diana Prince', role: 'PhD Scholar' },
                { id: '4', name: 'Ethan Hunt', role: 'PhD Scholar' },
                { id: '1774361137785', name: 'Fiona Gallagher', role: 'PhD Scholar' }
            ],
            researchAssociates: [
                { id: '5', name: 'Grace Shelby', role: 'Research Associate' },
                { id: '6', name: 'Hannah Abbott', role: 'Research Associate' },
                { id: '1774390824274', name: 'Iris West', role: 'Research Associate' }
            ],
            interns: [
                { id: '7', name: 'Jane Doe', role: 'Intern' },
                { id: '8', name: 'Kevin Malone', role: 'Intern' },
                { id: '9', name: 'Leo Davidson', role: 'Intern' },
            ],
        };
    }
    if (type === 'pi') {
        return {
            name: 'Dr. Evelyn Vance',
            role: 'Lead Research Scientist',
            affiliation: 'Advanced Systems Bio-Innovation Hub, Nexus Genomics Institute, Horizon City.',
            email: 'evelyn.vance@nexusgenomics.edu',
            altEmail: 'evelyn.vance.research@gmail.com',
            location: 'Building 4, Wing B, Horizon City',
            quote: '"Innovation lies at the intersection of biological complexity and robust computational architecture. We model life to decode its underlying algorithms."',
            featuredPublication: '"Next-Generation Computational Frameworks for Predictive Systems Biology" (Nature Systems, 2025 | IF: 14.2)',
            publications: [
                {
                    id: '1',
                    title: 'Next-Generation Computational Frameworks for Predictive Systems Biology',
                    link: 'https://doi.org/10.1038/s41540-025-example1'
                }
            ],
        };
    }
    if (type === 'research') {
        return {
            pageTitle: "Research Areas",
            pageSubtitle: "Exploring the molecular frontiers of herbal genomics and plant systems biology to unlock nature's therapeutic potential.",
            sidebarLabel: "Focus Areas",
            areas: [
                { id: 'herbal-genomics', title: 'Herbal Genomics', shortDesc: 'Decoding the genetic blueprint of medicinal and horticultural plants. Exploring the molecular frontiers of herbal genomics and plant systems biology to unlock nature\'s therapeutic potential through high-resolution genome mapping and annotation.', image: '/herbal-genomics-new.jpg' },
                { id: 'omics-integration', title: 'Omics Integration', shortDesc: 'Integrative transcriptomics, proteomics, and metabolomics for systems-level understanding. We synthesize multi-layered biological data to decipher the complex interactions governing plant secondary metabolism and therapeutic compound biosynthesis.', image: '/omics-integration-new.jpg' },
                { id: 'protein-structure', title: 'Protein Structure & Function', shortDesc: 'Protein modelling and functional analysis of molecular mechanisms involved in plant development and stress responses. Investigating the structural dynamics of key regulatory enzymes to predict and enhance medicinal plant productivity under fluctuating environments.', image: '/protein-structure-new.png' },
            ]
        };
    }
    if (type === 'facilities') {
        return [
            {
                id: 'smart-greenhouse',
                title: 'Smart Greenhouse System',
                description: 'Controlled-environment chambers enabling precise regulation of temperature, humidity, light, and soil parameters for plant physiology and stress-response studies.',
                longDesc: 'Our Smart Greenhouse System represents the pinnacle of controlled-environment agriculture. It features a networked array of IoT sensors that monitor every aspect of plant growth in real-time. Researchers can simulate diverse climatic conditions, from arid deserts to tropical rainforests, allowing for unprecedented studies into plant resilience and adaptive mechanisms.',
                stats: [
                    { label: 'TEMP RANGE', value: '18-28°C (Std: 22°C)' },
                    { label: 'CURRENT TEMP', value: '24.2°C' },
                    { label: 'HUMIDITY RANGE', value: '55-75% (Std: 60%)' },
                    { label: 'CURRENT HUMIDITY', value: '64.8%' },
                    { label: 'SOIL MOISTURE', value: '35-50% (Std: 40%)' },
                    { label: 'CURRENT MOISTURE', value: '41.5%' },
                    { label: 'CO2 LEVELS', value: '400-1200ppm (Std: 800)' },
                    { label: 'SENSORS', value: '524 Nodes' }
                ],
                image: '/dashboard-greenhouse.png'
            },
            {
                id: 'laminar-systems',
                title: 'In-Vitro Culture & Laminar Systems',
                description: 'Sterile tissue culture facilities equipped with laminar airflow systems for aseptic plant propagation, micropropagation, and controlled experimental studies.',
                longDesc: 'The In-Vitro Culture facility is designed for high-precision botanical research requiring absolute sterility. Our ISO-certified clean rooms house multiple laminar flow cabinets that provide Class 100 air quality for aseptic handling.',
                stats: [
                    { label: 'AIR VELOCITY', value: '0.36-0.54m/s (Std: 0.45)' },
                    { label: 'CURRENT VELOCITY', value: '0.46m/s' },
                    { label: 'HEPA FILTER', value: 'H14 Efficiency (99.995%)' },
                    { label: 'CLEAN CLASS', value: 'ISO 5 (Class 100)' },
                    { label: 'ACTIVE CULTURES', value: '182 Lines' },
                    { label: 'SUCCESS RATE', value: '98.5%' }
                ],
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
            }
        ];
    }
    if (type === 'goals') {
        return [
            {
                id: 'nexus-genome-atlas',
                title: 'Biological System Mapping',
                description: 'Completing a comprehensive genomic and transcriptomic atlas for target biological systems to uncover novel regulatory networks.',
                longDesc: 'Our primary strategic goal is the construction of a multi-dimensional "Life Map" for priority biological systems. This involves the complete de novo assembly of complex genomes and the exhaustive mapping of their expression profiles across various developmental stages and environmental conditions.',
                progress: 80,
                target: 'April 2026',
                image: '/herbal-genomics-new.jpg',
                breakdown: [
                    { label: 'Phase 1: Genome Assembly', plan: 'De novo assembly of 10 priority systems', achieved: '100%', remaining: '0%', desc: 'Complete chromosomal-level assembly for all target species.' },
                    { label: 'Phase 2: Expression Mapping', plan: 'Exhaustive transcriptome profiling', achieved: '85%', remaining: '15%', desc: 'Mapping spatio-temporal expression patterns.' },
                    { label: 'Phase 3: Network Annotation', plan: 'Regulatory hub identification', achieved: '60%', remaining: '40%', desc: 'Annotating core transcription factor networks.' },
                    { label: 'Phase 4: Functional Validation', plan: 'In-silico knockouts and verification', achieved: '40%', remaining: '60%', desc: 'Validating predicted hubs via computational modeling.' },
                    { label: 'Phase 5: Atlas Integration', plan: 'Final multi-omics data merge', achieved: '20%', remaining: '80%', desc: 'Merging all datasets into a centralized knowledge base.' }
                ]
            },
            {
                id: 'predictive-platform',
                title: 'Predictive Analysis Deployment',
                description: 'Developing and deploying an AI-driven platform for predicting biological system responses to multi-factor stimuli.',
                longDesc: 'We are building the next generation of predictive biology. Our AI platform integrates vast amounts of multi-omics data to simulate biological responses with high fidelity.',
                progress: 65,
                target: 'July 2026',
                image: '/hero-crystal.png',
                breakdown: [
                    { label: 'Phase 1: Core Engine', plan: 'Neural network architecture design', achieved: '100%', remaining: '0%', desc: 'Building the fundamental AI processing layer.' },
                    { label: 'Phase 2: Data Integration', plan: 'Multi-omics data ingestion pipeline', achieved: '80%', remaining: '20%', desc: 'Connecting diverse biological data streams.' },
                    { label: 'Phase 3: Model Training', plan: 'Large-scale parameter optimization', achieved: '60%', remaining: '40%', desc: 'Training the platform on existing datasets.' },
                    { label: 'Phase 4: Predictive Testing', plan: 'Blind-validation against known results', achieved: '30%', remaining: '70%', desc: 'Testing accuracy on historical biological data.' },
                    { label: 'Phase 5: Global Deployment', plan: 'Production-ready UI/UX rollout', achieved: '10%', remaining: '90%', desc: 'Final scaling for international research use.' }
                ]
            }
        ];
    }
    if (type === 'settings') {
        // No hardcoded credentials — settings must be initialized via /api/auth
        return { adminId: '' };
    }
    if (type === 'about') {
        return {
            speech: {
                title: "A Message from the Director",
                content: "Welcome to the Nexus Genomics Institute...",
                author: "Dr. Evelyn Vance",
                designation: "Principal Investigator & Founding Director"
            },
            mission: {
                title: "Our Mission",
                content: "To push the boundaries of genomic research..."
            },
            vision: {
                title: "Our Vision",
                content: "To become a global leader in personalized medicine..."
            },
            history: [
                { "year": "2020", "event": "Foundation of Nexus Genomics Institute." },
                { "year": "2022", "event": "Successful integration of the first AI-driven sequencer." },
                { "year": "2024", "event": "Global recognition for the Herbal Omics Initiative." }
            ],
            social: {
                whatsapp: "",
                email: "vance.nexus@nexusgenomics.edu",
                linkedin: "",
                twitter: ""
            }
        };
    }
    return {};
}

const FILE_MAP: Record<string, string> = {
    sessions: 'admin-sessions.json',
    team: 'admin-team.json',
    pi: 'admin-pi.json',
    research: 'admin-research.json',
    facilities: 'admin-facilities.json',
    goals: 'admin-goals.json',
    settings: 'admin-settings.json',
    about: 'admin-about.json',
};

// GET — Return data for a specific type
export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    if (!type || !FILE_MAP[type]) {
        return NextResponse.json({ error: 'Invalid type. Use: sessions, team, pi, research, facilities, goals' }, { status: 400 });
    }

    if (type === 'settings') {
        const authError = await requireAdmin(request);
        if (authError) return authError;
    }

    const data = await readJSON(FILE_MAP[type]);
    if (data === null) {
        // Return defaults if file doesn't exist
        const defaults = getDefaults(type);
        await writeJSON(FILE_MAP[type], defaults);
        // Never send password to client
        if (type === 'settings') {
            const settingsDefaults = defaults as { adminId: string; password: string };
            return NextResponse.json({ adminId: settingsDefaults.adminId });
        }
        return NextResponse.json(defaults);
    }
    // Never send password to client
    if (type === 'settings') {
        return NextResponse.json({ adminId: data.adminId || '' }, {
            headers: { 'Cache-Control': 'no-store, max-age=0' },
        });
    }
    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}

// POST — Save data for a specific type (requires admin authentication)
export async function POST(request: NextRequest) {
    // Auth & CSRF check
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !FILE_MAP[type]) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // Input validation: reject excessively large payloads
        const serialized = JSON.stringify(data);
        if (serialized.length > 500_000) {
            return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
        }

        // If saving settings, hash the password before writing
        if (type === 'settings' && data.password && !isHashed(data.password)) {
            data.password = await hashPassword(data.password);
        }

        // Validate payload structure using schema library at the API boundary
        const schema = schemas[type];
        if (schema) {
            const validationResult = schema.safeParse(data);
            if (!validationResult.success) {
                return NextResponse.json({ 
                    error: 'Validation failed', 
                    details: validationResult.error.format() 
                }, { status: 400 });
            }
        }

        await writeJSON(FILE_MAP[type], data);

        // Broadcast real-time updates via WebSockets
        try {
            const { wsManager } = await import('@/lib/ws');
            wsManager.broadcast(type, data);
        } catch (err) {
            console.error('[WS] Failed to broadcast update:', err);
        }
        
        // Purge Next.js cache across all public routes to force global re-indexing
        revalidatePath('/');
        revalidatePath('/research');
        revalidatePath('/facilities');
        revalidatePath('/goals');
        revalidatePath('/about');
        revalidatePath('/join');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
