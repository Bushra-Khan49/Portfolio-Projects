import { MetadataRoute } from 'next';
import { readDataJSON } from '@/lib/db';
import { researchData, facilitiesData, goalsData, sessionsData } from '@/data/mockData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://nexus-genomics-institute.vercel.app';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/facilities',
        '/goals',
        '/join',
        '/privacy',
        '/research',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Fetch dynamic research areas
    let researchSlugs: string[] = [];
    try {
        const research = await readDataJSON('research', { areas: researchData });
        const areas = Array.isArray(research) ? research : (research?.areas || []);
        researchSlugs = areas.map((r: any) => r.id);
    } catch (e) {
        console.error('[Sitemap] Failed to load research areas:', e);
        researchSlugs = researchData.map(r => r.id);
    }

    // Fetch dynamic facilities
    let facilitiesSlugs: string[] = [];
    try {
        const facilities = await readDataJSON('facilities', facilitiesData);
        facilitiesSlugs = (facilities || []).map((f: any) => f.id);
    } catch (e) {
        console.error('[Sitemap] Failed to load facilities:', e);
        facilitiesSlugs = facilitiesData.map(f => f.id);
    }

    // Fetch dynamic goals
    let goalsSlugs: string[] = [];
    try {
        const goals = await readDataJSON('goals', goalsData);
        goalsSlugs = (goals || []).map((g: any) => g.id);
    } catch (e) {
        console.error('[Sitemap] Failed to load goals:', e);
        goalsSlugs = goalsData.map(g => g.id);
    }

    // Fetch dynamic sessions (from mockData since dynamic session detail routes depend on it)
    const sessionsSlugs = sessionsData.map((s: any) => s.id);

    // Combine all dynamic URLs
    const dynamicPages = [
        ...researchSlugs.map(id => ({
            url: `${baseUrl}/research/${id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
        ...facilitiesSlugs.map(id => ({
            url: `${baseUrl}/facilities/${id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
        ...goalsSlugs.map(id => ({
            url: `${baseUrl}/goals/${id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
        ...sessionsSlugs.map(id => ({
            url: `${baseUrl}/sessions/${id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        })),
    ];

    return [...staticPages, ...dynamicPages];
}
