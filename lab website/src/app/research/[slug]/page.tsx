import { notFound } from 'next/navigation';
import { readDataJSON } from '@/lib/db';
import { researchData } from '@/data/mockData';
import ResearchDetailPageClient from './ResearchDetailPageClient';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getResearchItem(slug: string) {
    const res = await readDataJSON('research', { areas: researchData });
    const areas = Array.isArray(res) ? res : (res?.areas || []);
    return areas.find((r: any) => r.id === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const item = await getResearchItem(slug);
    if (!item) {
        return {
            title: 'Research Area Not Found | Nexus Genomics Institute',
        };
    }
    return {
        title: `${item.title} | Research | Nexus Genomics Institute`,
        description: item.shortDesc,
        openGraph: {
            title: `${item.title} | Research | Nexus Genomics Institute`,
            description: item.shortDesc,
            images: item.image ? [{ url: item.image }] : [],
        }
    };
}

export default async function ResearchDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getResearchItem(slug);

    if (!data) {
        notFound();
    }

    const projectJsonLd = {
        "@context": "https://schema.org",
        "@type": "ResearchProject",
        "name": data.title,
        "description": data.shortDesc,
        "image": data.image,
        "sponsor": {
            "@type": "ResearchOrganization",
            "name": "Nexus Genomics Institute",
            "url": "https://nexus-genomics-institute.vercel.app"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
            />
            <ResearchDetailPageClient data={data} />
        </>
    );
}
