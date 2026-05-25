import type { Metadata } from 'next';
import FacilitiesPageClient from './FacilitiesPageClient';

export const metadata: Metadata = {
    title: 'Research Infrastructure & Facilities | Nexus Genomics Institute',
    description: 'Learn about our state-of-the-art facilities, including the Smart Greenhouse System, and sterile in-vitro tissue culture & laminar systems.',
    openGraph: {
        title: 'Research Infrastructure & Facilities | Nexus Genomics Institute',
        description: 'Learn about our state-of-the-art facilities, including the Smart Greenhouse System, and sterile in-vitro tissue culture & laminar systems.',
        url: 'https://nexus-genomics-institute.vercel.app/facilities',
    }
};

export default function FacilitiesPage() {
    return <FacilitiesPageClient />;
}
