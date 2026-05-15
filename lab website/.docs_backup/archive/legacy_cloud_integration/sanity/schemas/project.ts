// Sanity Schema: Project (Goals & Milestones)

export default {
    name: 'project',
    title: 'Project & Milestone',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Project Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Project Description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Portable text area for detailed research descriptions.',
        },
        {
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        },
        {
            name: 'targetDate',
            title: 'Target/End Date',
            type: 'date',
        },
        {
            name: 'progressPercent',
            title: 'Progress Percentage (0-100slider)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0).max(100),
            description: 'Used for real-time visual circular preview tracking.',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Planned', value: 'planned' },
                    { title: 'Ongoing', value: 'ongoing' },
                    { title: 'Completed', value: 'completed' },
                ],
            },
            // Architectural Hook logic represented here: Auto assign completed if progress >= 100 
            // This logic will be executed via a Sanity documentAction hook in production,
            // but is defined here for schema completeness.
            initialValue: 'planned',
        },
        {
            name: 'relatedPublications',
            title: 'Related Publications',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'publication' }], // Assuming an external publication schema
                },
            ],
            description: 'Searchable dropdown pulling from the publication schema.',
        },
    ],
    preview: {
        select: {
            title: 'title',
            progress: 'progressPercent',
            status: 'status',
        },
        prepare(selection: any) {
            const { title, progress, status } = selection;
            return {
                title,
                subtitle: `${progress}% - ${status.toUpperCase()}`,
            };
        },
    },
};
