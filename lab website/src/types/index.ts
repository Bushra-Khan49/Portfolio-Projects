/**
 * Shared TypeScript interfaces for the Nexus Genomics Institute platform.
 * Used by both admin dashboard and public-facing components.
 */

// ═══════════════════════════════════════════════════════
//  RESEARCH
// ═══════════════════════════════════════════════════════

export interface ResearchArea {
    id: string;
    title: string;
    shortDesc: string;
    longDesc?: string;
    image: string;
}

// ═══════════════════════════════════════════════════════
//  FACILITIES
// ═══════════════════════════════════════════════════════

export interface FacilityStat {
    label: string;
    value: string;
}

export interface Facility {
    id: string;
    title: string;
    description: string;
    longDesc?: string;
    stats: FacilityStat[];
    image: string;
}

// ═══════════════════════════════════════════════════════
//  GOALS
// ═══════════════════════════════════════════════════════

export interface GoalBreakdown {
    label: string;
    plan: string;
    achieved: string;
    remaining: string;
    desc: string;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    longDesc?: string;
    progress: number;
    target: string;
    image: string;
    breakdown?: GoalBreakdown[];
}

// ═══════════════════════════════════════════════════════
//  SESSIONS / MEETINGS
// ═══════════════════════════════════════════════════════

export interface MeetingData {
    title: string;
    number: string;
    purpose: string;
    date: string;
    time: string;
    location: string;
}

export interface Presenter {
    id: string;
    presenter: string;
    topic: string;
    time: string;
    status?: string;
}

export interface HistoryEntry {
    id: string;
    title: string;
    number: string;
    date: string;
    time: string;
    location: string;
    purpose: string;
    presenters: Presenter[];
    archivedAt: string;
}

export interface SessionsData {
    meeting: MeetingData;
    presenters: Presenter[];
    history?: HistoryEntry[];
}

// ═══════════════════════════════════════════════════════
//  TEAM
// ═══════════════════════════════════════════════════════

export interface TeamMember {
    id: string;
    name: string;
    role: string;
}

export interface TeamData {
    phdScholars: TeamMember[];
    researchAssociates: TeamMember[];
    interns: TeamMember[];
}

// ═══════════════════════════════════════════════════════
//  PI PROFILE
// ═══════════════════════════════════════════════════════

export interface Publication {
    id: string;
    title: string;
    link: string;
}

export interface PIData {
    name: string;
    role: string;
    affiliation: string;
    email: string;
    altEmail: string;
    location: string;
    quote: string;
    featuredPublication: string;
    publications: Publication[];
}

// ═══════════════════════════════════════════════════════
//  APPLICATIONS
// ═══════════════════════════════════════════════════════

export interface Application {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    country: string;
    institute: string;
    position: string;
    period: string;
    joinDate: string;
    endDate: string;
    topic: string;
    resumePath?: string;
    resumeFilename?: string;
    submittedAt: string;
    status: string;
}

export interface AboutData {
    speech: {
        title: string;
        content: string;
        author: string;
        designation: string;
    };
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    history: { year: string; event: string }[];
    social: {
        whatsapp: string;
        email: string;
        linkedin: string;
        twitter: string;
    };
}
