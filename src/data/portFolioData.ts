export interface Project {
  id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  techStack: string[];
  fullDetails?: string[];
  role?: string;
  duration?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  coverImage?: string;
}

export const allProjects: Project[] = [
  // --- ENGINEERING / PRODUCT ---
  {
    id: "homelink-gh",
    category: "Engineering",
    title: "HomeLinkGH Service Platform",
    role: "Founder & Product Owner",
    client: "Venture (Self-Funded)",
    duration: "Jan 2024 - Present",
    summary: "Defined the product vision, roadmap, and backlog for a dual-sided marketplace connecting homeowners with verified service providers across 9 regions. Shipped to iOS and Android from 0→1.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Stripe"],
    image: "/assets/images/homelinkgh_logo.png",
    coverImage: "/assets/images/homelinkgh_logo.png",
    slug: "homelink-gh",
    fullDetails: [
      "Conducted market research and user interviews to validate product-market fit in the Ghanaian home services market.",
      "Defined product vision, OKRs, and a phased roadmap — prioritizing trust & safety features (Ghana Card verification) as the core differentiator.",
      "Owned and groomed the full product backlog; facilitated sprint planning and retrospectives across design and engineering cycles.",
      "Made key product decisions: dynamic pricing model, 9-region rollout sequence, provider onboarding flow, and dual-role user accounts.",
      "Designed and built the dual-sided marketplace app for iOS and Android as the sole engineer.",
      "Integrated real-time geo-location tracking, dynamic pricing algorithms, and secure payment gateways.",
    ],
    challenge: "Homeowners in Ghana had no reliable way to find verified service providers. The market was fragmented, trust was low, and there was zero price transparency.",
    solution: "Led end-to-end product development — from market research and product definition through build and App Store launch. Set the product strategy: lead with trust (Ghana Card verification), then grow supply before demand. Managed a phased roadmap to control scope and ship fast.",
    results: [
      "Shipped to iOS and Android App Stores as sole Product Owner and developer.",
      "Defined and executed a 3-phase roadmap covering 9 major regions of Ghana.",
      "Implemented trust-first product strategy (Ghana Card ID verification) that became the core value prop.",
      "Dynamic pricing and real-time booking increased provider earnings and repeat bookings.",
    ],
  },
  {
    id: "beacon-app",
    category: "Engineering",
    title: "Beacon of New Beginnings",
    role: "Product Owner & Developer",
    client: "Non-Profit",
    duration: "Oct 2023 - Dec 2023",
    summary: "Product-owned and built a trauma-informed crisis support app from 0→1 in 8 weeks. Defined privacy-first architecture as the core product requirement — no cloud data, no digital footprint.",
    techStack: ["Flutter", "SQLite", "Encryption", "Accessibility"],
    image: "/assets/images/beacon_logo.png",
    coverImage: "/assets/images/beacon_logo.png",
    slug: "beacon-app",
    fullDetails: [
      "Ran discovery sessions with the non-profit stakeholders to define user personas and core use cases for survivors of domestic abuse.",
      "Made the key product decision: local-first, no-cloud architecture — directly addressing the safety needs of the target user.",
      "Prioritized accessibility and high-stress usability as first-class product requirements, not afterthoughts.",
      "Scoped a lean MVP to deliver in 8 weeks: offline resource library, emergency contacts, and panic button disguise feature.",
      "Built end-to-end with local SQLite storage and device-level encryption.",
      "Integrated an emergency resource directory with full offline access.",
    ],
    challenge: "Survivors of domestic abuse often cannot safely use cloud-connected apps — digital footprints can endanger lives. Existing solutions required logins that left traces.",
    solution: "Defined 'zero digital footprint' as the non-negotiable product constraint and built around it. Local-first SQLite architecture, no cloud sync, and a panic button that instantly disguises the app. Delivered a full MVP in 8 weeks.",
    results: [
      "Shipped a fully encrypted, offline-capable product in 8 weeks from discovery to App Store.",
      "Zero-knowledge privacy model protects vulnerable users with no cloud data exposure.",
      "Accessible, high-stress UX designed around survivor mental models, not generic app patterns.",
      "Panic button feature provides immediate safety — a product differentiator no competitor offers.",
    ],
  },
  {
    id: "faith-klinik",
    category: "Engineering",
    title: "Faith Klinik Ministries",
    role: "Product Owner & Developer",
    client: "Faith Klinik",
    duration: "Aug 2023 - Present",
    summary: "Defined requirements, built, and shipped a church management system with role-based access, live streaming, and a member portal. Replaced a fragmented manual process with one unified platform.",
    techStack: ["React", "Node.js", "AWS", "Live Streaming SDK"],
    image: "/assets/images/faithklinik-icon.png",
    coverImage: "/assets/images/faithklinik-icon.png",
    slug: "faith-klinik",
    fullDetails: [
      "Ran stakeholder discovery sessions with ministry leadership to map pain points and define product scope.",
      "Prioritized three core product pillars: member management, financial transparency, and remote access via live streaming.",
      "Designed role-based access control (RBAC) model as a product requirement — ensuring admin, staff, and member permissions were right-sized.",
      "Made build vs. buy decisions for streaming (third-party SDK integration) and payment processing.",
      "Built and deployed the full platform on AWS, managing infrastructure as part of the product delivery.",
    ],
    challenge: "The ministry was managing member engagement, donations, and remote services across disconnected tools — spreadsheets, WhatsApp, and manual bank transfers — creating administrative chaos and missed connections.",
    solution: "Led requirements gathering and product scoping, then built and shipped a unified web platform. Prioritized live streaming and donation tracking as the two highest-value features and deferred lower-priority items to a v2 roadmap.",
    results: [
      "Replaced 4 disconnected tools with one unified platform, eliminating administrative overhead.",
      "Live streaming feature expanded the ministry's reach to remote congregants globally.",
      "Centralized donation tracking gave leadership real-time financial visibility for the first time.",
      "Role-based access control eliminated unauthorized data access risks.",
    ],
  },

  // --- ENTERPRISE / CORPORATE ---
  {
    id: "comerica-grc",
    category: "Enterprise",
    title: "Comerica Bank GRC Transformation",
    role: "Technical Lead / Product Owner",
    client: "Comerica Bank",
    duration: "Jul 2022 - Present",
    summary: "Owned the product backlog and roadmap for an enterprise GRC platform transformation. Delivered 17% portfolio risk reduction and 30% operational efficiency improvement as measurable product outcomes.",
    techStack: ["Archer GRC", "Tableau", "SQL", "Jira"],
    image: "/assets/images/comerica.png",
    coverImage: "/assets/images/comerica.png",
    slug: "enterprise-grc",
    fullDetails: [
      "Partnered with executive stakeholders to define product vision, OKRs, and multi-quarter roadmap for the GRC platform.",
      "Owned and managed the full product backlog — wrote user stories, defined acceptance criteria, and ran sprint planning with the engineering team.",
      "Prioritized features by business value: automated risk registers and real-time executive dashboards delivered first.",
      "Conducted stakeholder interviews across 6 business units to surface requirements and build alignment.",
      "Presented product strategies, risk assessments, and sprint outcomes directly to executive leadership.",
      "Reduced manual processes by 40% through strategic automation initiatives.",
    ],
    challenge: "Fragmented risk mitigation strategies and manual reporting across departments created operational inefficiencies and elevated portfolio risk. Leadership lacked real-time visibility into risk posture.",
    solution: "Acted as Product Owner for the full GRC platform lifecycle — from discovery through delivery. Built a prioritized backlog, ran agile sprints, and made tradeoff decisions to keep the team focused on business-value features. Automated risk registers and executive dashboards were the first releases.",
    results: [
      "Reduced portfolio risk by 17% via effective risk mitigation strategies.",
      "Improved operational efficiency by 30% through high-value feature delivery.",
      "Reduced manual processes by 40% through strategic automation.",
      "Delivered full executive dashboard providing real-time risk visibility for the first time.",
    ],
  },
  {
    id: "huntington-risk",
    category: "Enterprise",
    title: "Unified Risk Management Integration",
    role: "Sr. GRC Product Owner",
    client: "Huntington National Bank",
    duration: "Aug 2016 - May 2022",
    summary: "Served as Sr. Product Owner for a major Archer GRC platform integration during a bank merger. Increased data security by 79%, data availability by 56%, and cut process time by 25%.",
    techStack: ["Archer", "Agile/Scrum", "Data Analytics"],
    image: "/assets/images/huntington.png",
    coverImage: "/assets/images/huntington.png",
    slug: "unified-risk-management",
    fullDetails: [
      "Defined and prioritized product backlog based on business value across merging company systems.",
      "Championed the integration of disparate data sources from the merged organization into a single unified Archer GRC platform.",
      "Translated high-level business requirements into technical user stories and acceptance criteria for the development team.",
      "Conducted cost-benefit analysis and ROI projections for new features and enhancements.",
      "Delivered Archer Integrated GRC Platform, increasing data security by 79%.",
      "Increased data availability by 56% and reduced process time by 25%.",
    ],
    challenge: "A major bank merger created data silos, security vulnerabilities, and slow process times across two previously separate risk systems — hindering accurate risk assessment.",
    solution: "Served as Sr. Product Owner, championing the integration of disparate systems into one unified Archer GRC platform. Managed backlog, wrote user stories, and aligned stakeholders across both legacy organizations throughout a multi-year transformation.",
    results: [
      "Increased data security by 79% through unified platform implementation.",
      "Boosted data availability by 56% — stakeholders gained real-time access to risk data.",
      "Reduced process time by 25% for the platform implementation lifecycle.",
      "Successfully aligned two merged organizations on a single product vision.",
    ],
  },
  {
    id: "jpmc-agile",
    category: "Enterprise",
    title: "Agile Workflow Optimization",
    role: "Business Analyst / Project Coordinator",
    client: "JP Morgan Chase",
    duration: "Mar 2014 - Aug 2016",
    summary: "Managed projects in an Agile framework at JP Morgan Chase. Coordinated 500+ scrum calls, translated business requirements into user stories, and liaised between business and engineering.",
    techStack: ["Jira", "Visio", "Data Flow Diagrams"],
    image: "/assets/images/jpmorgan.png",
    coverImage: "/assets/images/jpmorgan.png",
    slug: "jpmc-agile",
    fullDetails: [
      "Coordinated over 500 scrum calls and sprint activities to ensure schedule adherence.",
      "Managed and tracked progress throughout product lifecycle using Agile tools.",
      "Engaged stakeholders to gather requirements and define project scope.",
      "Translated business requirements into user stories, workflow diagrams, and data flows.",
      "Interpreted data analytics to develop actionable strategies for upper management.",
      "Liaised between business and development teams as primary point of contact.",
    ],
    challenge: "Managing cross-functional teams across different locations led to communication gaps and potential delays in software enhancements.",
    solution: "Implemented a rigorous Agile framework, coordinating over 500 scrum calls to maintain alignment. Served as the primary liaison between business units and development teams.",
    results: [
      "Coordinated 500+ scrum calls ensuring 100% task completion on schedule.",
      "Interpreted data analytics to provide actionable strategies to upper management.",
      "Ensured timely delivery of software enhancements through effective sprint management.",
    ],
  },
  {
    id: "target-systems",
    category: "Enterprise",
    title: "Retail Systems Enhancement",
    role: "Business Analyst / Project Coordinator",
    client: "Target Corporation",
    duration: "Sep 2011 - Mar 2014",
    summary: "Facilitated 70+ requirements sessions and translated 300+ business requirements into functional specs at Target Corporation. Managed project timelines from initiation through launch.",
    techStack: ["Requirements Gathering", "Functional Specs", "Data Analysis"],
    image: "/assets/images/targetcorp.jpg",
    coverImage: "/assets/images/targetcorp.jpg",
    slug: "target-systems",
    fullDetails: [
      "Facilitated over 70 requirements gathering sessions to elicit business needs.",
      "Translated over 300 high-level business requirements into detailed functional specs.",
      "Coordinated development of project schedules and implementation plans.",
      "Managed project timelines and deliverables from initiation through launch.",
      "Optimized data collection and reporting procedures for decision-making.",
      "Identified system functionality gaps and recommended solutions.",
    ],
    challenge: "Large-scale system enhancements faced ambiguity in business needs, requiring precise alignment between organizational goals and technical capabilities.",
    solution: "Facilitated intensive requirements gathering workshops (70+ sessions) to elicit needs. Translated over 300 high-level requirements into detailed functional specifications.",
    results: [
      "Facilitated 70+ requirements gathering sessions to drive project clarity.",
      "Translated 300+ complex business requirements into actionable technical specs.",
      "Optimized data collection procedures to support executive decision-making.",
    ],
  },
];
