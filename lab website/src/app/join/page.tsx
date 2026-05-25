import type { Metadata } from 'next';
import JoinLabPageClient from './JoinLabPageClient';

export const metadata: Metadata = {
    title: 'Join Our Team | Careers | Nexus Genomics Institute',
    description: 'Apply to join the Nexus Genomics Institute. Submit your application, CV/resume, and research interests to become a part of our laboratory.',
    openGraph: {
        title: 'Join Our Team | Careers | Nexus Genomics Institute',
        description: 'Apply to join the Nexus Genomics Institute. Submit your application, CV/resume, and research interests to become a part of our laboratory.',
        url: 'https://nexus-genomics-institute.vercel.app/join',
    }
};

export default function JoinLabPage() {
    return <JoinLabPageClient />;
}
