import { notFound } from 'next/navigation';
import { readDataJSON } from '@/lib/db';
import { facilitiesData } from '@/data/mockData';
import FacilityDetailPageClient from './FacilityDetailPageClient';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getFacilityItem(slug: string) {
    const res = await readDataJSON('facilities', facilitiesData);
    return (res || []).find((f: any) => f.id === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const item = await getFacilityItem(slug);
    if (!item) {
        return {
            title: 'Facility Not Found | Nexus Genomics Institute',
        };
    }
    return {
        title: `${item.title} | Facilities | Nexus Genomics Institute`,
        description: item.description,
        openGraph: {
            title: `${item.title} | Facilities | Nexus Genomics Institute`,
            description: item.description,
            images: item.image ? [{ url: item.image }] : [],
        }
    };
}

export default async function FacilityDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getFacilityItem(slug);

    if (!data) {
        notFound();
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the purpose of the ${data.title}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": data.longDesc || data.description
                }
            },
            {
                "@type": "Question",
                "name": `What are the operational specifications of the ${data.title}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": data.stats && data.stats.length > 0
                        ? `The specifications are: ${data.stats.map((s: any) => `${s.label}: ${s.value}`).join(', ')}.`
                        : `Specifications and real-time telemetry pending.`
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <FacilityDetailPageClient data={data} />
        </>
    );
}
