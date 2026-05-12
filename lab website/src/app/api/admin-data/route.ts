import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { revalidatePath } from 'next/cache';

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

async function writeJSON(filename: string, data: any) {
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    await writeFile(join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

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
                location: 'Room No. 38, SCIS, JNU',
            },
            presenters: [
                { id: '1', presenter: 'Priya Sharma', topic: 'Silicon-mediated stress tolerance in Mentha species', time: '11:00 AM IST', status: 'scheduled' },
                { id: '2', presenter: 'Gautami Gajdeyo', topic: 'Transcriptomic analysis of drought response pathways', time: '1:30 PM IST', status: 'scheduled' },
                { id: '3', presenter: 'Seema Jaiswal', topic: 'High-throughput annotation of secondary metabolites', time: '3:00 PM IST', status: 'scheduled' },
                { id: '4', presenter: 'Matilda', topic: 'Targeted genome editing strategies in medicinal herbs', time: '4:30 PM IST', status: 'scheduled' },
            ],
            history: [],
        };
    }
    if (type === 'team') {
        return {
            phdScholars: [
                { id: '1', name: 'Gautami Gajdeyo', role: 'PhD Scholar' },
                { id: '2', name: 'Seema Jaiswal', role: 'PhD Scholar' },
                { id: '3', name: 'Matilda', role: 'PhD Scholar' },
                { id: '4', name: 'Raja', role: 'PhD Scholar' },
            ],
            researchAssociates: [
                { id: '5', name: 'Shivani', role: 'Research Associate' },
                { id: '6', name: 'Shraddha', role: 'Research Associate' },
            ],
            interns: [
                { id: '7', name: 'Bushra', role: 'Intern' },
                { id: '8', name: 'Shreerag', role: 'Intern' },
                { id: '9', name: 'Obyed', role: 'Intern' },
            ],
        };
    }
    if (type === 'pi') {
        return {
            name: 'Dr. Abinaya Manivannan',
            role: 'Assistant Professor',
            affiliation: 'HerbalOMICS and Bio-Innovation Laboratory, School of Computational and Integrative Sciences, Jawaharlal Nehru University, New Delhi.',
            email: 'abinaya@mail.jnu.ac.in',
            altEmail: 'abinayamanivannan@gmail.com',
            location: 'Room No. 38, SCIS, JNU',
            quote: '"Science is not just about discovery—it is about understanding the questions worth asking. In our laboratory, medicinal plants are explored as dynamic biological systems shaped by molecular regulation, environment, and evolutionary processes."',
            featuredPublication: '"Mentha arvensis and Mentha x piperita – Vital Herbs with Myriads of Pharmaceutical Benefits" (Horticulturae, 2023 | IF: 3.1)',
            publications: [
                {
                    id: '1',
                    title: 'Mentha arvensis and Mentha x piperita – Vital Herbs with Myriads of Pharmaceutical Benefits',
                    link: 'https://doi.org/10.3390/horticulturae9020283'
                }
            ],
        };
    }
    if (type === 'research') {
        return [
            { id: 'herbal-genomics', title: 'Herbal Genomics', shortDesc: 'Decoding the genetic blueprint of medicinal and horticultural plants.', image: '/herbal-genomics-new.jpg' },
            { id: 'omics-integration', title: 'Omics Integration', shortDesc: 'Integrative transcriptomics, proteomics, and metabolomics for systems-level understanding.', image: '/omics-integration-new.jpg' },
            { id: 'protein-structure', title: 'Protein Structure & Function', shortDesc: 'Protein modelling and functional analysis of molecular mechanisms involved in plant development and stress responses.', image: '/protein-structure-new.png' },
        ];
    }
    if (type === 'facilities') {
        return [
            { id: 'smart-greenhouse', title: 'Smart Greenhouse System', description: 'Controlled-environment chambers enabling precise regulation of temperature, humidity, light, and soil parameters.', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600' },
            { id: 'in-vitro-culture', title: 'In-Vitro Culture & Laminar Systems', description: 'Sterile tissue culture facilities equipped with laminar airflow systems for aseptic plant propagation.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600' },
        ];
    }
    if (type === 'goals') {
        return [
            { id: 'mentha-genome', title: 'Complete Mentha genome assembly', description: 'Finalizing the long-read sequencing and chromosome-scale assembly of Mentha species.', progress: 75, target: 'March 2026', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800' },
            { id: 'silicon-network', title: 'Establish silicon response network', description: 'Mapping the transcriptomic and metabolomic changes in medicinal plants.', progress: 60, target: 'June 2026', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800' },
        ];
    }
    if (type === 'settings') {
        return {
            adminId: 'abinaya222@gmail.com',
            password: 'herbalomicspanel'
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
};

// GET — Return data for a specific type
export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    if (!type || !FILE_MAP[type]) {
        return NextResponse.json({ error: 'Invalid type. Use: sessions, team, pi, research, facilities, goals' }, { status: 400 });
    }

    const data = await readJSON(FILE_MAP[type]);
    if (data === null) {
        // Return defaults if file doesn't exist
        const defaults = getDefaults(type);
        await writeJSON(FILE_MAP[type], defaults);
        return NextResponse.json(defaults);
    }
    return NextResponse.json(data);
}

// POST — Save data for a specific type
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !FILE_MAP[type]) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        await writeJSON(FILE_MAP[type], data);
        
        // Purge Next.js cache for the main site
        revalidatePath('/');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
