import { notFound } from 'next/navigation';
import { readDataJSON } from '@/lib/db';
import { goalsData } from '@/data/mockData';
import GoalDetailPageClient from './GoalDetailPageClient';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getGoalItem(slug: string) {
    const res = await readDataJSON('goals', goalsData);
    return (res || []).find((g: any) => g.id === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const item = await getGoalItem(slug);
    if (!item) {
        return {
            title: 'Strategic Goal Not Found | Nexus Genomics Institute',
        };
    }
    return {
        title: `${item.title} | Strategic Goals | Nexus Genomics Institute`,
        description: item.description,
        openGraph: {
            title: `${item.title} | Strategic Goals | Nexus Genomics Institute`,
            description: item.description,
            images: item.image ? [{ url: item.image }] : [],
        }
    };
}

export default async function GoalDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getGoalItem(slug);

    if (!data) {
        notFound();
    }

    return <GoalDetailPageClient data={data} />;
}
