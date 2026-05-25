import type { Metadata } from 'next';
import ResearchAreasPageClient from './ResearchAreasPageClient';

export const metadata: Metadata = {
    title: 'Research Areas & Initiatives | Nexus Genomics Institute',
    description: 'Explore our cutting-edge research focus areas, including herbal genomics, systems biology, omics integration, protein structural analysis, and computational chemistry.',
    openGraph: {
        title: 'Research Areas & Focus | Nexus Genomics Institute',
        description: 'Explore our cutting-edge research focus areas, including herbal genomics, systems biology, omics integration, protein structural analysis, and computational chemistry.',
        url: 'https://nexus-genomics-institute.vercel.app/research',
    }
};

export default function ResearchAreasPage() {
    return <ResearchAreasPageClient />;
}
