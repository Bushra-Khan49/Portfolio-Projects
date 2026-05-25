import type { Metadata } from 'next';
import GoalsPageClient from './GoalsPageClient';

export const metadata: Metadata = {
    title: 'Strategic Goals & Progress | Nexus Genomics Institute',
    description: 'Track our institutional milestones, progress, and goals, including system mapping, AI-driven platforms, and our open-access frameworks.',
    openGraph: {
        title: 'Strategic Goals & Progress | Nexus Genomics Institute',
        description: 'Track our institutional milestones, progress, and goals, including system mapping, AI-driven platforms, and our open-access frameworks.',
        url: 'https://nexus-genomics-institute.vercel.app/goals',
    }
};

export default function GoalsPage() {
    return <GoalsPageClient />;
}
