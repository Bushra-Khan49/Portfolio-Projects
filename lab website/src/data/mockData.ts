// mockData.ts
// Exact text extracted from Figma Prototype

export const researchData = [
    {
        id: 'herbal-genomics',
        title: 'Herbal Genomics',
        shortDesc: 'Decoding the genetic blueprint of medicinal and horticultural plants.',
        longDesc: 'Herbal genomics focuses on mapping the complex genetic landscapes of medicinal and horticultural plant species. By employing advanced sequencing technologies and bioinformatic assemblies, we identify the genes responsible for key therapeutic traits and secondary metabolite pathways, providing the foundational knowledge needed for crop improvement and phytochemical discovery.',
        image: '/herbal-genomics-new.jpg'
    },
    {
        id: 'omics-integration',
        title: 'Omics Integration',
        shortDesc: 'Integrative transcriptomics, proteomics, and metabolomics for systems-level understanding.',
        longDesc: 'Our research integrates multiple layers of biological data — from transcripts to proteins and metabolites — to construct a holistic view of plant systems. This systems-level approach allows us to unravel the regulatory networks and metabolic flux that govern plant responses to environmental stimuli and developmental triggers.',
        image: '/omics-integration-new.jpg'
    },
    {
        id: 'protein-structure',
        title: 'Protein Structure & Function',
        shortDesc: 'Protein modelling and functional analysis of molecular mechanisms involved in plant development and stress responses.',
        longDesc: 'We investigate the three-dimensional architecture of key plant proteins to understand their biochemical roles. Using structural bioinformatics and molecular modeling, we predict binding sites and functional motifs, enabling us to engineer proteins with enhanced properties or to design targeted interventions in plant pathways.',
        image: '/protein-structure-new.png'
    },
    {
        id: 'systems-biology',
        title: 'Systems Biology',
        shortDesc: 'Network-level analysis of regulatory pathways governing plant growth, development and adaptation.',
        longDesc: 'We apply mathematical and computational frameworks to model the behavior of entire biological systems. By analyzing the interactions between genes and metabolites at a network scale, we predict how plants will respond to genetic or environmental changes, facilitating the design of more resilient and productive plant systems.',
        image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'computational-analysis',
        title: 'Computational Analysis',
        shortDesc: 'NGS data analysis, big-data biology, and computational modelling for plant omics research.',
        longDesc: 'Computational analysis is the backbone of our research, enabling us to process and interpret massive datasets. We develop and optimize bioinformatic pipelines for NGS data analysis, including genome assembly, variant calling, and differential expression studies, ensuring that our biological insights are grounded in robust statistical evidence.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'phytochemistry-drug-discovery',
        title: 'Phytochemistry & Drug Discovery',
        shortDesc: 'Isolation, characterization, and pharmacological evaluation of bioactive plant compounds for novel therapeutic agents.',
        longDesc: 'We explore the chemical diversity of plants to identify novel bioactive compounds with therapeutic potential. Our research combines traditional phytochemical isolation techniques with modern pharmacological screening to discover and characterize secondary metabolites that can serve as leads for drug development in human health.',
        image: '/uploads/research-phytochemistry-drug-discovery.jpg'
    }
];

export const facilitiesData = [
    {
        id: 'smart-greenhouse',
        title: 'Smart Greenhouse System',
        description: 'Controlled-environment chambers enabling precise regulation of temperature, humidity, light, and soil parameters for plant physiology and stress-response studies.',
        longDesc: 'Our Smart Greenhouse System represents the pinnacle of controlled-environment agriculture. It features a networked array of IoT sensors that monitor every aspect of plant growth in real-time. Researchers can simulate diverse climatic conditions, from arid deserts to tropical rainforests, allowing for unprecedented studies into plant resilience and adaptive mechanisms. The facility is equipped with automated irrigation, spectral-tuned LED lighting, and CO2 enrichment systems, all integrated into a centralized dashboard for remote monitoring and data logging.',
        stats: [
            { label: 'TEMP RANGE', value: '18-28°C (Std: 22°C)' },
            { label: 'CURRENT TEMP', value: '24.2°C' },
            { label: 'HUMIDITY RANGE', value: '55-75% (Std: 60%)' },
            { label: 'CURRENT HUMIDITY', value: '64.8%' },
            { label: 'SOIL MOISTURE', value: '35-50% (Std: 40%)' },
            { label: 'CURRENT MOISTURE', value: '41.5%' },
            { label: 'CO2 LEVELS', value: '400-1200ppm (Std: 800)' },
            { label: 'SENSORS', value: '524 Nodes' }
        ],
        image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'laminar-systems',
        title: 'In-Vitro Culture & Laminar Systems',
        description: 'Sterile tissue culture facilities equipped with laminar airflow systems for aseptic plant propagation, micropropagation, and controlled experimental studies.',
        longDesc: 'The In-Vitro Culture facility is designed for high-precision botanical research requiring absolute sterility. Our ISO-certified clean rooms house multiple laminar flow cabinets that provide Class 100 air quality for aseptic handling. We specialize in micropropagation, somaclonal variation studies, and the conservation of rare medicinal species. The facility also includes specialized growth chambers with programmable photoperiods and temperature gradients, facilitating complex experiments in plant morphogenesis and secondary metabolite production.',
        stats: [
            { label: 'AIR VELOCITY', value: '0.36-0.54m/s (Std: 0.45)' },
            { label: 'CURRENT VELOCITY', value: '0.46m/s' },
            { label: 'HEPA FILTER', value: 'H14 Efficiency (99.995%)' },
            { label: 'CLEAN CLASS', value: 'ISO 5 (Class 100)' },
            { label: 'ACTIVE CULTURES', value: '182 Lines' },
            { label: 'SUCCESS RATE', value: '98.5%' }
        ],
        image: 'https://images.unsplash.com/photo-1581093583449-80d601dfdf0e?auto=format&fit=crop&q=80&w=800'
    }
];

export const sessionsData = [
    {
        id: 'nexus-pi-keynote',
        title: 'The Future of Predictive Systems Biology',
        presenter: 'Dr. Evelyn Vance',
        time: '10:00 AM',
        date: '2026-06-15T10:00:00Z'
    },
    {
        id: 'genomic-frameworks',
        title: 'Multi-Omics Integration in Precision Medicine',
        presenter: 'Alice Vance',
        time: '11:30 AM',
        date: '2026-06-15T11:30:00Z'
    },
    {
        id: 'structural-insights',
        title: 'Rational Design of Molecular Architectures',
        presenter: 'Ethan Hunt',
        time: '2:00 PM',
        date: '2026-06-15T14:00:00Z'
    },
    {
        id: 'computational-pipelines',
        title: 'Scalable Bioinformatic Workflows for Big Data',
        presenter: 'Clara Oswald',
        time: '3:30 PM',
        date: '2026-06-15T15:30:00Z'
    }
];

export const goalsData = [
    {
        id: 'nexus-genome-atlas',
        title: 'Biological System Mapping',
        description: 'Completing a comprehensive genomic and transcriptomic atlas for target biological systems to uncover novel regulatory networks.',
        longDesc: 'Our primary strategic goal is the construction of a multi-dimensional "Life Map" for priority biological systems. This involves the complete de novo assembly of complex genomes and the exhaustive mapping of their expression profiles across various developmental stages and environmental conditions. By leveraging our Nexus Genomics suite, we aim to identify the core regulatory hubs that govern system stability and productivity, providing a definitive reference for future bio-engineering efforts.',
        progress: 80,
        target: 'April 2026',
        image: '/herbal-genomics-new.jpg',
        breakdown: [
            { label: 'Phase 1: Genome Assembly', plan: 'De novo assembly of 10 priority systems', achieved: '100%', remaining: '0%', desc: 'Complete chromosomal-level assembly for all target species.' },
            { label: 'Phase 2: Expression Mapping', plan: 'Exhaustive transcriptome profiling', achieved: '85%', remaining: '15%', desc: 'Mapping spatio-temporal expression patterns.' },
            { label: 'Phase 3: Network Annotation', plan: 'Regulatory hub identification', achieved: '60%', remaining: '40%', desc: 'Annotating core transcription factor networks.' },
            { label: 'Phase 4: Functional Validation', plan: 'In-silico knockouts and verification', achieved: '40%', remaining: '60%', desc: 'Validating predicted hubs via computational modeling.' },
            { label: 'Phase 5: Atlas Integration', plan: 'Final multi-omics data merge', achieved: '20%', remaining: '80%', desc: 'Merging all datasets into a centralized knowledge base.' }
        ]
    },
    {
        id: 'predictive-platform',
        title: 'Predictive Analysis Deployment',
        description: 'Developing and deploying an AI-driven platform for predicting biological system responses to multi-factor stimuli.',
        longDesc: 'We are building the next generation of predictive biology. Our AI platform integrates vast amounts of multi-omics data to simulate biological responses with high fidelity. By utilizing deep learning and mechanistic modelling, the platform allows researchers to "test" genetic modifications or environmental changes in silico before moving to the lab. This drastically reduces the time and cost of experimental discovery and opens new frontiers in precision agriculture and drug development.',
        progress: 65,
        target: 'July 2026',
        image: '/hero-crystal.png',
        breakdown: [
            { label: 'Phase 1: Core Engine', plan: 'Neural network architecture design', achieved: '100%', remaining: '0%', desc: 'Building the fundamental AI processing layer.' },
            { label: 'Phase 2: Data Integration', plan: 'Multi-omics data ingestion pipeline', achieved: '80%', remaining: '20%', desc: 'Connecting diverse biological data streams.' },
            { label: 'Phase 3: Model Training', plan: 'Large-scale parameter optimization', achieved: '60%', remaining: '40%', desc: 'Training the platform on existing datasets.' },
            { label: 'Phase 4: Predictive Testing', plan: 'Blind-validation against known results', achieved: '30%', remaining: '70%', desc: 'Testing accuracy on historical biological data.' },
            { label: 'Phase 5: Global Deployment', plan: 'Production-ready UI/UX rollout', achieved: '10%', remaining: '90%', desc: 'Final scaling for international research use.' }
        ]
    },
    {
        id: 'open-source-discovery',
        title: 'Open-Access Research Framework',
        description: 'Launching a standardized research framework for integrated discovery, promoting collaborative and reproducible science.',
        longDesc: 'Transparency and collaboration are at the heart of the Nexus Genomics Institute. We are developing an open-access framework that standardizes biological data formats and analysis pipelines. This goal includes the release of our internal software tools and datasets to the global research community. By fostering a shared ecosystem, we aim to accelerate the pace of global discovery and ensure that the benefits of genomics research are accessible to all.',
        progress: 45,
        target: 'September 2026',
        image: '/omics-integration-new.jpg',
        breakdown: [
            { label: 'Phase 1: Protocol Standardization', plan: 'Unified data format definitions', achieved: '95%', remaining: '5%', desc: 'Defining the common language for our pipelines.' },
            { label: 'Phase 2: Tool Refactoring', plan: 'Open-sourcing internal discovery code', achieved: '60%', remaining: '40%', desc: 'Cleaning and documenting code for public use.' },
            { label: 'Phase 3: API Development', plan: 'Standardized access endpoints', achieved: '40%', remaining: '60%', desc: 'Building the gateway for remote data access.' },
            { label: 'Phase 4: Security Layer', plan: 'Privacy and data protection audit', achieved: '20%', remaining: '80%', desc: 'Ensuring safe sharing of sensitive genomic data.' },
            { label: 'Phase 5: Community Launch', plan: 'Public repository and docs release', achieved: '5%', remaining: '95%', desc: 'Final rollout to the global research community.' }
        ]
    },
    {
        id: 'translational-scaling',
        title: 'Translational Discovery Scaling',
        description: 'Scaling our computational discovery pipeline to support large-scale translational research projects globally.',
        longDesc: 'The final pillar of our strategy is the massive scaling of our discovery engine. We are transitioning from localized biological studies to global-scale translational projects. This involves the deployment of our Nexus Framework across international satellite labs and the integration of diverse multi-ethnic genomic datasets. By scaling our infrastructure, we aim to bring genomics-driven solutions to real-world challenges in health and food security on a global stage.',
        progress: 30,
        target: 'December 2026',
        image: '/goal-mentha-genome.jpg',
        breakdown: [
            { label: 'Phase 1: Regional Audit', plan: 'Global infrastructure capability check', achieved: '100%', remaining: '0%', desc: 'Mapping out international partner resources.' },
            { label: 'Phase 2: Node Setup', plan: 'Deployment of satellite processing nodes', achieved: '50%', remaining: '50%', desc: 'Setting up the first wave of regional hubs.' },
            { label: 'Phase 3: Data Sync Engine', plan: 'Global real-time sync protocols', achieved: '30%', remaining: '70%', desc: 'Connecting regional hubs to the central brain.' },
            { label: 'Phase 4: Capacity Scaling', plan: 'Horizontal compute resource expansion', achieved: '15%', remaining: '85%', desc: 'Boosting total throughput for global projects.' },
            { label: 'Phase 5: Operation Rollout', plan: 'Full translational project launch', achieved: '5%', remaining: '95%', desc: 'Going live with the first global-scale study.' }
        ]
    }
];

export const teamData = {
    pi: {
        name: 'Dr. Evelyn Vance',
        role: 'Lead Research Scientist',
        affiliation: 'Advanced Systems Bio-Innovation Hub, Nexus Genomics Institute, Horizon City.',
        email: 'evelyn.vance@nexusgenomics.edu',
        altEmail: 'evelyn.vance.research@gmail.com',
        location: 'Building 4, Wing B, Horizon City',
        quote: '"Innovation lies at the intersection of biological complexity and robust computational architecture. We model life to decode its underlying algorithms."',
        featuredPublication: '"Next-Generation Computational Frameworks for Predictive Systems Biology" (Nexus Systems Journal, 2025)',
        publications: [
            {
                id: '1',
                title: 'Next-Generation Computational Frameworks for Predictive Systems Biology',
                link: 'https://nexusgenomics.edu/publications/predictive-systems-biology-2025'
            }
        ]
    },
    phdScholars: [
        { id: '1', name: 'Alice Vance', role: 'PhD Scholar' },
        { id: '2', name: 'Clara Oswald', role: 'PhD Scholar' },
        { id: '3', name: 'Diana Prince', role: 'PhD Scholar' },
        { id: '4', name: 'Ethan Hunt', role: 'PhD Scholar' },
        { id: '5', name: 'Fiona Gallagher', role: 'PhD Scholar' },
    ],
    researchAssociates: [
        { id: '6', name: 'Grace Shelby', role: 'Research Associate' },
        { id: '7', name: 'Hannah Abbott', role: 'Research Associate' },
        { id: '8', name: 'Iris West', role: 'Research Associate' },
    ],
    interns: [
        { id: '9', name: 'Jane Doe', role: 'Intern' },
        { id: '10', name: 'Kevin Malone', role: 'Intern' },
        { id: '11', name: 'Leo Davidson', role: 'Intern' },
    ]
};
