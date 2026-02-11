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
  duration?: string; // Added Duration
  challenge?: string;
  solution?: string;
  results?: string[];
  coverImage?: string;
}

export const allProjects: Project[] = [
  // --- 1. ENGINEERING / VENTURES ---
  {
    id: "homelink-gh",
    category: "Engineering",
    title: "HomeLinkGH Service Platform",
    role: "Lead Architect & Developer",
    client: "Venture (Self-Funded)",
    duration: "Jan 2024 - Present", // Added
    summary: "AI-powered marketplace connecting homeowners with verified service providers across 9 regions.",
    techStack: ["Flutter", "Firebase", "Google Maps API", "Stripe"],
    image: "/assets/images/homelinkgh_logo.png",
    coverImage: "/assets/images/homelinkgh_logo.png",
    slug: "homelink-gh",
    fullDetails: [
      "Designed and built a dual-sided marketplace app for iOS and Android.",
      "Implemented Ghana Card ID verification for provider trust and safety.",
      "Developed real-time geo-location tracking for service bookings.",
      "Integrated dynamic pricing algorithms based on demand and location.",
    ],
    challenge: "Homeowners in Ghana struggled to find verified, trustworthy service providers. The market was fragmented, relying on word-of-mouth with no price transparency or safety guarantees.",
    solution: "Designed and built a dual-sided marketplace app. Implemented Ghana Card ID verification for providers, real-time geo-location for booking, and an AI-driven matching algorithm to pair homeowners with the nearest available experts.",
    results: [
      "Deployed to iOS and Android App Stores covering 9 major regions.",
      "Implemented real-time booking & dynamic pricing to increase provider earnings.",
      "Integrated secure payment gateways ensuring safe transactions for users.",
    ],
  },
  {
    id: "beacon-app",
    category: "Engineering",
    title: "Beacon of New Beginnings",
    role: "Full Stack Developer",
    client: "Non-Profit",
    duration: "Oct 2023 - Dec 2023", // Added
    summary: "Trauma-informed crisis support application with privacy-first architecture.",
    techStack: ["Flutter", "SQLite", "Encryption", "Accessibility"],
    image: "/assets/images/beacon_logo.png",
    coverImage: "/assets/images/beacon_logo.png",
    slug: "beacon-app",
    fullDetails: [
      "Built a privacy-first architecture with local data storage (SQLite).",
      "Implemented end-to-end encryption for all user communications.",
      "Designed accessible UI/UX for users in high-stress situations.",
      "Integrated emergency resource directories with offline access.",
    ],
    challenge: "Survivors of domestic abuse often lack safe, digital access to resources. Existing apps required cloud logins which left digital footprints that could endanger the user.",
    solution: "Architected a 'local-first' application using SQLite. No data is sent to the cloud unless explicitly shared. Implemented a 'Panic Button' feature that instantly disguises the app interface.",
    results: [
      "Delivered a fully encrypted, offline-capable resource library.",
      "Ensured zero-knowledge privacy for vulnerable users.",
      "Created an accessible interface optimized for high-stress usability.",
    ],
  },
  {
    id: "faith-klinik",
    category: "Engineering",
    title: "Faith Klinik Ministries",
    role: "Full Stack Developer",
    client: "Faith Klinik",
    duration: "Aug 2023 - Present", // Added
    summary: "Church management system with role-based access and live streaming.",
    techStack: ["React", "Node.js", "AWS", "Live Streaming SDK"],
    image: "/assets/images/faithklinik-icon.png",
    coverImage: "/assets/images/faithklinik-icon.png",
    slug: "faith-klinik",
    fullDetails: [
      "Developed role-based access control for admins, members, and staff.",
      "Integrated live streaming capabilities for remote service attendance.",
      "Built a member portal for donation tracking and event registration.",
      "Deployed scalable backend infrastructure on AWS.",
    ],
    challenge: "The ministry lacked a unified digital platform to manage member engagement, donations, and remote services, leading to disjointed communication and administrative overhead.",
    solution: "Engineered a comprehensive web-based management system. Integrated third-party streaming SDKs for virtual services and built a secure financial module for donation tracking.",
    results: [
      "Centralized member management with secure Role-Based Access Control (RBAC).",
      "Boosted community engagement through integrated live streaming features.",
      "Streamlined administrative tasks for events and donation processing.",
    ],
  },

  // --- 2. ENTERPRISE / CORPORATE ---
  {
    id: "comerica-grc",
    category: "Enterprise",
    title: "Comerica Bank GRC Transformation",
    role: "Technical Lead / Product Owner",
    client: "Comerica Bank",
    duration: "Jul 2022 - Present", // Added
    summary: "Strategic GRC platform development. Reduced risk by 17% and improved efficiency by 30%.",
    techStack: ["Archer GRC", "Tableau", "SQL", "Jira"],
    image: "/assets/images/comerica.png",
    coverImage: "/assets/images/comerica.png",
    slug: "enterprise-grc",
    fullDetails: [
      "Partnered with key stakeholders to define product vision and roadmap.",
      "Managed product backlog and sprint planning, improving operational efficiency by 30%.",
      "Drove strategic initiatives resulting in 17% reduction in portfolio risk.",
      "Conducted market analysis and stakeholder interviews to identify business needs.",
      "Presented product strategies and risk assessments to executive leadership.",
    ],
    challenge: "The organization faced operational inefficiencies and high portfolio risk due to fragmented risk mitigation strategies and manual reporting processes across departments.",
    solution: "Led the strategic migration to a comprehensive GRC platform. Managed end-to-end product lifecycle, creating automated workflows for risk registers and executive dashboards for real-time visibility.",
    results: [
      "Reduced portfolio risk by 17% via effective risk mitigation strategies.",
      "Improved operational efficiency by 30% through high-value feature delivery.",
      "Reduced manual processes by 40% through strategic automation initiatives.",
    ],
  },
  {
    id: "huntington-risk",
    category: "Enterprise",
    title: "Unified Risk Management Integration",
    role: "Sr. GRC Product Owner",
    client: "Huntington National Bank",
    duration: "Aug 2016 - May 2022", // Added
    summary: "Led Agile transformation for Archer GRC. Increased data security by 79%.",
    techStack: ["Archer", "Agile/Scrum", "Data Analytics"],
    image: "/assets/images/huntington.png",
    coverImage: "/assets/images/huntington.png",
    slug: "unified-risk-management",
    fullDetails: [
      "Defined and prioritized product backlog based on business value.",
      "Championed integration of data from merging company systems into unified platform.",
      "Delivered Archer Integrated GRC Platform, increasing data security by 79%.",
      "Increased data availability by 56% and reduced process time by 25%.",
      "Conducted cost-benefit analysis for new features and enhancements.",
    ],
    challenge: "Merging company systems resulted in data silos, security vulnerabilities, and slow process times, hindering the organization's ability to assess risk accurately.",
    solution: "Championed the integration of disparate data sources into a single unified Archer GRC platform. Translated high-level business requirements into technical user stories for the development team.",
    results: [
      "Increased data security by 79% through unified platform implementation.",
      "Boosted data availability by 56%, ensuring stakeholders had real-time access.",
      "Reduced process time by 25% for the platform implementation lifecycle.",
    ],
  },
  {
    id: "jpmc-agile",
    category: "Enterprise",
    title: "Agile Workflow Optimization",
    role: "Business Analyst / Project Coordinator",
    client: "JP Morgan Chase",
    duration: "Mar 2014 - Aug 2016", // Added
    summary: "Managed projects in Agile framework. Coordinated 500+ scrum calls.",
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
      "Liaised between business and development teams as primary contact.",
    ],
    challenge: "Managing cross-functional teams across different locations led to communication gaps and potential delays in software enhancements.",
    solution: "Implemented a rigorous Agile framework, coordinating over 500 scrum calls to maintain alignment. Served as the primary liaison between business units and development teams.",
    results: [
      "Successfully coordinated 500+ scrum calls ensuring 100% task completion on schedule.",
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
    duration: "Sep 2011 - Mar 2014", // Added
    summary: "Facilitated 70+ requirements sessions. Translated 300+ business requirements.",
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