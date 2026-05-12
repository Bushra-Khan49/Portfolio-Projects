// mockData.ts
// Exact text extracted from Figma Prototype

export const researchData = [
    {
        id: 'herbal-genomics',
        title: 'Herbal Genomics',
        shortDesc: 'Decoding the genetic blueprint of medicinal and horticultural plants.',
        longDesc: 'Herbal genomics is the science of sequencing, assembling, and interpreting the complete genetic blueprints of medicinal and aromatic plants. It reveals the precise genetic instructions that govern the production of therapeutic compounds — from essential oils and alkaloids to flavonoids and terpenoids. For a lab focused on plant-based bioactive discovery, genomics provides the foundational roadmap that connects a plant\'s identity to its pharmaceutical potential, enabling targeted exploration of biosynthetic gene clusters and accelerating the development of phytomedicine.',
        image: '/herbal-genomics-new.jpg'
    },
    {
        id: 'omics-integration',
        title: 'Omics Integration',
        shortDesc: 'Integrative transcriptomics, proteomics, and metabolomics for systems-level understanding.',
        longDesc: 'Omics integration brings together data from transcriptomics, proteomics, and metabolomics to construct a complete molecular portrait of a plant under any given condition. Rather than studying genes or proteins in isolation, this multi-layered approach maps the full spectrum of biological activity — from which genes are switched on, to which proteins are produced, to which metabolites accumulate. In herbal science, this systems-level view is invaluable for tracing the molecular routes from environmental stress to secondary metabolite production, directly informing drug discovery and crop improvement.',
        image: '/omics-integration-new.jpg'
    },
    {
        id: 'protein-structure',
        title: 'Protein Structure & Function',
        shortDesc: 'Protein modelling and functional analysis of molecular mechanisms involved in plant development and stress responses.',
        longDesc: 'Protein structure and function analysis deciphers the three-dimensional architecture of plant proteins and how their shape determines their biochemical role. Using computational modelling, molecular docking, and structural bioinformatics, it becomes possible to predict how enzymes interact with substrates, how receptors bind ligands, and how stress-responsive proteins protect cellular integrity. For this lab, understanding the structural basis of key enzymes in secondary metabolite pathways allows precise identification of pharmacological targets and supports rational drug design from plant-derived molecules.',
        image: '/protein-structure-new.png'
    },
    {
        id: 'systems-biology',
        title: 'Systems Biology',
        shortDesc: 'Network-level analysis of regulatory pathways governing plant growth, development and adaptation.',
        longDesc: 'Systems biology takes a holistic, network-centric view of living organisms, modelling how genes, proteins, and metabolites interact as an integrated system rather than as individual components. Gene regulatory networks, protein–protein interaction maps, and metabolic flux models collectively reveal the emergent properties of plant physiology — particularly how plants sense and adapt to environmental changes. In the context of medicinal plant research, systems biology is critical for understanding why certain stress conditions trigger the accumulation of high-value compounds, providing a rational basis for optimising cultivation and extraction strategies.',
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'computational-analysis',
        title: 'Computational Analysis',
        shortDesc: 'NGS data analysis, big-data biology, and computational modelling for plant omics research.',
        longDesc: 'Computational analysis encompasses the bioinformatic pipelines, algorithms, and statistical frameworks that transform raw sequencing data into biological insight. From quality filtering and genome assembly to differential expression analysis and phylogenetic reconstruction, computational tools are the engine that makes large-scale omics research feasible. Within a herbal omics lab, these capabilities are indispensable — they allow simultaneous interrogation of thousands of genes across multiple plant species, identification of conserved biosynthetic genes, and cross-species comparison of metabolic pathways, all at a speed and scale impossible through conventional wet-lab methods alone.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'phytochemistry-drug-discovery',
        title: 'Phytochemistry & Drug Discovery',
        shortDesc: 'Isolation, characterization, and pharmacological evaluation of bioactive plant compounds for novel therapeutic agents.',
        longDesc: 'Phytochemistry is the systematic study of the chemical compounds produced by plants, encompassing their isolation, structural elucidation, and biological evaluation. Plants synthesise an extraordinary range of secondary metabolites — alkaloids, glycosides, terpenes, phenolics — many of which exhibit potent antimicrobial, anti-inflammatory, antioxidant, or anticancer properties. Bridging ancient ethnobotanical knowledge with modern analytical chemistry and in-silico drug screening, phytochemistry-driven drug discovery remains one of the most productive pipelines for identifying novel lead compounds. For this lab, it represents the translational arm that connects genomic and metabolomic discoveries to tangible biomedical applications.',
        image: '/uploads/research-phytochemistry-drug-discovery.jpg'
    }
];

export const facilitiesData = [
    {
        id: 'smart-greenhouse',
        title: 'Smart Greenhouse System',
        description: 'Controlled-environment chambers enabling precise regulation of temperature, humidity, light, and soil parameters for plant physiology and stress-response studies.',
        stats: [
            { label: 'AVERAGE TEMPERATURE', value: '24°C' },
            { label: 'RELATIVE HUMIDITY', value: '65%' }
        ],
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600' // High-tech greenhouse/growth chamber visual
    },
    {
        id: 'in-vitro-culture',
        title: 'In-Vitro Culture & Laminar Systems',
        description: 'Sterile tissue culture facilities equipped with laminar airflow systems for aseptic plant propagation, micropropagation, and controlled experimental studies.',
        stats: [
            { label: 'Active Cultures', value: '156 lines' }
        ],
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600' // Flask/In-vitro visual
    }
];

export const sessionsData = [
    {
        id: 'mentha-stress',
        title: 'Silicon-mediated stress tolerance in Mentha species',
        presenter: 'Priya Sharma',
        time: '11:00 AM IST',
        date: '2026-02-05T11:00:00+05:30'
    },
    {
        id: 'drought-pathways',
        title: 'Transcriptomic analysis of drought response pathways',
        presenter: 'Gautami Gajdeyo',
        time: '1:30 PM IST',
        date: '2026-02-05T13:30:00+05:30'
    },
    {
        id: 'metabolomics-pipeline',
        title: 'High-throughput annotation of secondary metabolites',
        presenter: 'Seema Jaiswal',
        time: '3:00 PM IST',
        date: '2026-02-05T15:00:00+05:30'
    },
    {
        id: 'crispr-editing',
        title: 'Targeted genome editing strategies in medicinal herbs',
        presenter: 'Matilda',
        time: '4:30 PM IST',
        date: '2026-02-05T16:30:00+05:30'
    }
];

export const goalsData = [
    {
        id: 'mentha-genome',
        title: 'Complete Mentha genome assembly',
        description: 'Finalizing the long-read sequencing and chromosome-scale assembly of Mentha species to uncover essential oil biosynthesis genes.',
        progress: 75,
        target: 'March 2026',
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'silicon-network',
        title: 'Establish silicon response network',
        description: 'Mapping the transcriptomic and metabolomic changes in medicinal plants under silicon-mediated stress alleviation.',
        progress: 60,
        target: 'June 2026',
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'metabolomics-pipeline',
        title: 'Publish metabolomics pipeline',
        description: 'Deploying an open-source computational pipeline for high-throughput untargeted plant metabolomics analysis.',
        progress: 40,
        target: 'August 2026',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800'
    }
];

export const teamData = {
    pi: {
        name: 'Dr. Abinaya Manivannan',
        role: 'Assistant Professor',
        affiliation: 'HerbalOMICS and Bio-Innovation Laboratory, School of Computational and Integrative Sciences, Jawaharlal Nehru University, New Delhi.',
        email: 'abinaya@mail.jnu.ac.in',
        altEmail: 'abinayamanivannan@gmail.com',
        location: 'Room No. 38, SCIS, JNU',
        quote: '"Science is not just about discovery—it is about understanding the questions worth asking. In our laboratory, medicinal plants are explored as dynamic biological systems shaped by molecular regulation, environment, and evolutionary processes."',
        featuredPublication: '"Mentha arvensis and Mentha x piperita – Vital Herbs with Myriads of Pharmaceutical Benefits" (Horticulturae, 2023 | IF: 3.1)',
        publications: [
            {
                id: '1',
                title: 'Mentha arvensis and Mentha x piperita – Vital Herbs with Myriads of Pharmaceutical Benefits',
                link: 'https://doi.org/10.3390/horticulturae9020283'
            }
        ]
    },
    phdScholars: ['Gautami Gajdeyo', 'Seema Jaiswal', 'Matilda', 'Raja'],
    researchAssociates: ['Shivani', 'Shraddha'],
    interns: ['Bushra', 'Shreerag', 'Obyed']
};
