// Sanity Schema: Team Member

export default {
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Full Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    { title: 'Principal Investigator (PI)', value: 'pi' },
                    { title: 'PhD Scholar', value: 'phd' },
                    { title: 'Research Associate', value: 'ra' },
                    { title: 'Intern', value: 'intern' },
                    { title: 'Collaborator', value: 'collaborator' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'bio',
            title: 'Biography (Portable Text)',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            options: {
                hotspot: true, // Enables UI hotspot cropping selection
            },
            validation: (Rule: any) => Rule.custom((image: any, context: any) => {
                // Require image for active members
                if (context.document.isActive && !image) {
                    return 'An image is required for active team members.';
                }
                return true;
            }),
        },
        {
            name: 'email',
            title: 'Email Address',
            type: 'string',
            validation: (Rule: any) =>
                Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email', invert: false })
                    .error('Must be a valid email address'),
        },
        {
            name: 'scholarLink',
            title: 'Google Scholar URL',
            type: 'url',
        },
        {
            name: 'linkedin',
            title: 'LinkedIn URL',
            type: 'url',
        },
        {
            name: 'isActive',
            title: 'Active Member',
            type: 'boolean',
            description: 'Toggle to show/hide this member on the live site.',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
            media: 'image',
        },
    },
};
