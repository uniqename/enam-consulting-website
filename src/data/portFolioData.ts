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
  // STAR fields for PO case studies
  situation?: string;
  task?: string;
  action?: string[];
  outcome?: string[];
  metrics?: { value: string; label: string }[];
  lessonsLearned?: string;
}

export const allProjects: Project[] = [

  // ─── ENGINEERING / PRODUCT ────────────────────────────────────────────────

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
    slug: "homelinkgh",

    // STAR narrative
    situation: "Ghana's home services market was entirely unstructured. Homeowners had no reliable way to find verified providers — they relied on word-of-mouth, WhatsApp referrals, and guesswork. There was no price transparency, no safety guarantee, and no accountability when work went wrong. The market existed, but no product had solved the trust problem.",
    task: "As Founder and sole Product Owner, I was responsible for everything from validating the opportunity to shipping a live product. My job was to define what to build, in what order, and why — then execute it. I had no team, a limited budget, and needed to reach product-market fit fast.",
    action: [
      "Conducted 20+ user interviews with Accra-area homeowners and tradespeople to map pain points and validate willingness to pay before writing a single line of code.",
      "Identified trust as the #1 blocker — providers had no credentials, users had no recourse. Made Ghana Card ID verification the core differentiator and P0 feature of the roadmap.",
      "Designed a three-role product (Homeowner, Provider, Admin) and mapped the full user journey for each persona before defining the feature backlog.",
      "Prioritized a lean v1: booking flow, verification, geo-location matching, and basic payment. Deferred reviews, chat, and analytics to v2 to avoid scope creep.",
      "Ran weekly sprint reviews solo — shipping, testing with real users in Accra, gathering feedback, and iterating the backlog.",
      "Made the call to build cross-platform (Flutter) rather than native to maximize coverage with minimal resources.",
      "Managed App Store and Play Store submission processes, including compliance, privacy policy, and review cycles.",
    ],
    outcome: [
      "Shipped to both iOS App Store and Google Play covering 9 major regions of Ghana — entirely self-funded.",
      "Ghana Card verification became a genuine trust signal; providers with verified badges received significantly higher booking rates.",
      "Dynamic pricing model increased average provider earnings per job compared to informal market rates.",
      "Real-time geo-location matching reduced the average time-to-booking compared to the WhatsApp referral baseline.",
      "Product is live and operational with zero external engineering support.",
    ],
    metrics: [
      { value: "9",    label: "Regions covered at launch" },
      { value: "0→1",  label: "Full product built solo" },
      { value: "3",    label: "User roles: homeowner, provider, admin" },
      { value: "2",    label: "App stores shipped simultaneously" },
    ],
    lessonsLearned: "Building a two-sided marketplace solo taught me that the hardest product problem isn't what to build — it's which side of the marketplace to seed first. I initially invested heavily in the provider onboarding flow, only to discover that without homeowner demand, providers lost motivation quickly. I pivoted the roadmap to prioritize demand-side growth and homeowner trust features before deepening provider tools. The lesson: in marketplace products, sequencing is strategy. I now build explicit 'chicken-and-egg' assumptions into the v1 roadmap and validate the demand side first.",
    // Legacy fields (kept for CaseStudy page fallback)
    challenge: "Ghana's home services market was completely unstructured — no verified providers, no price transparency, no accountability. Homeowners relied entirely on word-of-mouth with no safety guarantees.",
    solution: "Led end-to-end product development — from 20+ user interviews through backlog definition, sprint execution, and App Store launch. Made trust (Ghana Card verification) the P0 feature and built a phased roadmap to control scope and ship fast.",
    results: [
      "Shipped to iOS and Android covering 9 regions of Ghana as sole Product Owner.",
      "Ghana Card verification became a core trust differentiator — the product's primary competitive moat.",
      "Dynamic pricing and real-time geo-matching increased provider earnings and reduced time-to-booking.",
      "Entire product built, launched, and operated without external engineering support.",
    ],
    fullDetails: [
      "Conducted 20+ user interviews to validate product-market fit before writing code.",
      "Defined product vision, OKRs, and phased roadmap — prioritizing Ghana Card verification as P0.",
      "Designed three-role product architecture (Homeowner, Provider, Admin) with distinct user journeys.",
      "Owned and groomed the full product backlog; ran weekly sprint reviews and iterated based on real user feedback.",
      "Made cross-platform (Flutter) build decision to maximize coverage on a solo-developer budget.",
      "Managed iOS App Store and Google Play submission, compliance, and review cycles.",
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
    slug: "beacon",

    situation: "A non-profit serving domestic abuse survivors had no digital resource. Survivors needed quick access to hotlines, safe houses, and legal aid — but every app in this space required a cloud login, which left a digital trace that could be discovered by an abuser and put the survivor in danger. The non-profit had a mission but no product, no tech team, and an 8-week window before their grant cycle ended.",
    task: "I was brought in as Product Owner and sole developer. My primary responsibility was to define what a safe, effective product actually looked like for this user — not a generic app repurposed for a sensitive context, but a product built from the ground up around the safety constraints of survivors in active danger.",
    action: [
      "Ran discovery sessions with the non-profit's caseworkers and counselors to understand the real-world context of use — what survivors needed, when they needed it, and what made existing solutions dangerous.",
      "Identified the core product constraint: zero cloud data. Any data stored server-side could be subpoenaed, hacked, or discovered. Made local-first SQLite architecture a non-negotiable product requirement, not an engineering detail.",
      "Defined three must-have features for v1: offline resource library (hotlines, safe houses, legal aid), quick-exit button, and app disguise mode — a feature that instantly changes the app's appearance to something innocuous.",
      "Scoped and cut ruthlessly: deferred community features, push notifications, and account creation entirely — all of which would have required a server and created the exact risk we were designing against.",
      "Designed the UX around high-stress usability — large touch targets, minimal cognitive load, one-tap access to critical resources.",
      "Shipped the full product to the App Store in 8 weeks from the first discovery session.",
    ],
    outcome: [
      "Delivered a fully encrypted, offline-capable product in 8 weeks from discovery to App Store submission.",
      "Zero-knowledge privacy model: no user data ever leaves the device unless the user explicitly chooses to share.",
      "App disguise feature directly addresses the most critical safety scenario — an abuser picking up the phone.",
      "Non-profit gained a professional, purpose-built tool to share with survivors — replacing a PDF list of phone numbers.",
      "Accessibility-first design validated by caseworkers as appropriate for high-stress, low-literacy use cases.",
    ],
    metrics: [
      { value: "8 wks", label: "Discovery to App Store" },
      { value: "0",     label: "Cloud data stored" },
      { value: "3",     label: "P0 features scoped and shipped" },
      { value: "100%",  label: "Offline capable" },
    ],
    challenge: "Survivors of domestic abuse cannot safely use cloud-connected apps — digital footprints can be discovered by abusers and cause serious harm. Existing solutions all required logins that left traces.",
    solution: "Defined 'zero digital footprint' as the non-negotiable product constraint. Scoped a lean v1 around three P0 features — offline resource library, quick-exit button, and app disguise mode — and shipped from discovery to App Store in 8 weeks.",
    results: [
      "Shipped a fully encrypted, offline-capable product in 8 weeks.",
      "Zero-knowledge privacy: no user data ever leaves the device.",
      "App disguise feature directly addresses the most dangerous real-world scenario.",
      "Accessibility-first UX validated by caseworkers for high-stress, low-literacy contexts.",
    ],
    fullDetails: [
      "Ran discovery sessions with caseworkers and counselors to map real-world use context.",
      "Made local-first SQLite architecture a non-negotiable product requirement based on user safety research.",
      "Defined and scoped v1 to three P0 features: offline resources, quick-exit, and app disguise.",
      "Cut all features requiring server-side data (accounts, push notifications, community) to protect users.",
      "Designed UX for high-stress usability: large touch targets, minimal cognitive load, one-tap resource access.",
      "Shipped from first discovery session to App Store in 8 weeks.",
    ],
  },

  {
    id: "faith-klinik",
    category: "Engineering",
    title: "Faith Klinik Ministries",
    role: "Product Owner & Developer",
    client: "Faith Klinik",
    duration: "Aug 2023 - Present",

    summary: "Defined requirements, built, and shipped a church management system with role-based access, live streaming, and a member portal — replacing four disconnected tools with one platform.",
    techStack: ["React", "Node.js", "AWS", "Live Streaming SDK"],
    image: "/assets/images/faithklinik-icon.png",
    coverImage: "/assets/images/faithklinik-icon.png",
    slug: "faithklinik",

    situation: "Faith Klinik Ministries was managing its entire operation across four disconnected tools: a spreadsheet for members, WhatsApp for communication, manual bank transfers for donations, and no solution at all for remote attendees who couldn't physically reach the venue. Leadership had no visibility into finances or attendance. Staff spent hours each week on manual admin tasks that could be automated.",
    task: "I was engaged as Product Owner and developer to define, build, and ship a unified platform. The challenge wasn't just building software — it was deciding what to build first, what to defer, and what to cut entirely so that the ministry got a working product quickly without months of scope creep.",
    action: [
      "Ran stakeholder workshops with ministry leadership and staff to map current workflows, identify pain points, and define success criteria before writing any requirements.",
      "Identified three highest-value product pillars through stakeholder prioritization: member management with RBAC, financial transparency with real-time donation tracking, and remote access via live streaming.",
      "Made a deliberate build vs. buy decision: streaming (third-party SDK) and payments (existing processor) would be integrated rather than built — keeping scope lean and shipping faster.",
      "Designed and enforced a role-based access control model as a product requirement — admin, staff, and member tiers with clearly defined permissions, preventing unauthorized data access.",
      "Created a v2 roadmap for lower-priority items (event registration, small groups, mobile app) so leadership understood what was deferred and why.",
      "Built and deployed the platform on AWS with scalable infrastructure to support growth.",
    ],
    outcome: [
      "Replaced 4 disconnected tools (spreadsheet, WhatsApp, bank transfers, no-streaming) with a single unified platform.",
      "Live streaming feature expanded ministry reach to remote congregants globally — previously impossible.",
      "Donation tracking gave leadership real-time financial visibility for the first time in the ministry's history.",
      "RBAC eliminated unauthorized data access and reduced administrative coordination overhead significantly.",
      "Staff reported materially reduced time on manual admin tasks after platform launch.",
    ],
    metrics: [
      { value: "4→1",  label: "Tools consolidated" },
      { value: "3",    label: "User roles with RBAC" },
      { value: "∞",    label: "Remote reach: global streaming" },
      { value: "Real-time", label: "Financial visibility (first time)" },
    ],
    challenge: "The ministry ran across 4 disconnected tools — spreadsheets, WhatsApp, manual bank transfers, no streaming. Leadership had zero financial visibility and no way to reach remote congregants.",
    solution: "Ran stakeholder workshops to identify three P0 pillars, made build vs. buy decisions to keep scope lean, designed RBAC as a first-class product requirement, and shipped a unified AWS-hosted platform.",
    results: [
      "Consolidated 4 tools into one unified platform.",
      "Live streaming expanded the ministry's reach to remote congregants globally.",
      "Real-time donation tracking gave leadership financial visibility for the first time.",
      "RBAC eliminated unauthorized access and reduced admin overhead.",
    ],
    fullDetails: [
      "Ran stakeholder workshops to map workflows and define success criteria before writing requirements.",
      "Prioritized three product pillars: member management, financial transparency, and live streaming.",
      "Made build vs. buy decisions (streaming SDK, payment processor) to keep scope lean.",
      "Enforced RBAC as a product requirement — admin, staff, and member tiers with defined permissions.",
      "Created a v2 roadmap to communicate what was deferred and why.",
      "Built and deployed scalable platform on AWS.",
    ],
  },

  // ─── ENTERPRISE / CORPORATE ────────────────────────────────────────────────

  {
    id: "comerica-grc",
    category: "Enterprise",
    title: "Comerica Bank GRC Transformation",
    role: "Technical Lead / Product Owner",
    client: "Comerica Bank",
    duration: "Jul 2022 - Feb 2026",

    summary: "Owned the product backlog and roadmap for an enterprise GRC platform transformation. Delivered 17% portfolio risk reduction and 30% operational efficiency improvement as measurable product outcomes.",
    techStack: ["Archer GRC", "Tableau", "SQL", "Jira"],
    image: "/assets/images/comerica.png",
    coverImage: "/assets/images/comerica.png",
    slug: "enterprise-grc",

    situation: "Comerica Bank's risk management function was operating on fragmented, manual processes across six business units. Risk registers were maintained in spreadsheets, reporting was done ad hoc, and executive leadership had no real-time view of the bank's portfolio risk posture. The result: elevated portfolio risk, operational inefficiency, and an inability to respond to emerging threats quickly.",
    task: "I was brought in as Product Owner to lead the transformation of the GRC function onto a modern platform. My mandate was to define the product vision, build and prioritize the backlog, manage delivery across sprints, and ensure that every feature shipped had a clear, measurable business outcome — not just technical completion.",
    action: [
      "Conducted stakeholder interviews across 6 business units to surface the true root causes of inefficiency — not just technology gaps, but process gaps and misaligned incentives that no software could fix alone.",
      "Defined the product vision and a multi-quarter roadmap with executive alignment: automate risk registers first, then build real-time executive dashboards, then expand to audit management.",
      "Wrote and owned the full product backlog in Jira — user stories with clear acceptance criteria, prioritized by business value, not by what was technically easiest.",
      "Ran Agile sprints with the engineering team, conducting sprint planning, daily standups, reviews, and retrospectives — maintaining velocity and removing blockers.",
      "Made deliberate scope decisions: pushed several nice-to-have reporting features to v2 to protect the delivery of the two highest-ROI features — automated risk registers and executive dashboards.",
      "Presented product strategy, roadmap progress, and risk outcome metrics directly to executive leadership on a quarterly basis.",
      "Delivered a 40% reduction in manual processes through strategic automation — freeing analyst time for higher-value work.",
    ],
    outcome: [
      "Reduced portfolio risk by 17% — a measurable outcome tracked against pre-transformation baseline.",
      "Improved operational efficiency by 30% through sprint-delivered automation of previously manual workflows.",
      "Reduced manual processes by 40% via targeted automation of risk registers and reporting.",
      "Delivered real-time executive dashboards — leadership now has live portfolio risk visibility for the first time.",
      "Maintained Agile delivery cadence across a multi-quarter transformation at a Fortune 500 bank.",
    ],
    metrics: [
      { value: "17%",  label: "Portfolio risk reduced" },
      { value: "30%",  label: "Operational efficiency gained" },
      { value: "40%",  label: "Manual processes eliminated" },
      { value: "6",    label: "Business units aligned" },
    ],
    lessonsLearned: "The biggest lesson from this engagement was that stakeholder alignment is itself a deliverable — not a prerequisite. Early on, I assumed executive sponsorship was enough to drive adoption across all six business units. In practice, I underestimated the change management burden at the analyst level — the people who had built their careers around spreadsheet-based risk workflows. Midway through the program, I recognized the gap and added a formal adoption and training workstream to the backlog, which materially improved rollout success in the final two business units. If I were starting over, I'd scope change management as a first-class track from day one, not as a reaction to resistance.",
    challenge: "Risk management across 6 business units was entirely manual — spreadsheet risk registers, ad hoc reporting, and zero real-time executive visibility. Portfolio risk was elevated and leadership couldn't respond to emerging threats quickly.",
    solution: "Acted as Product Owner for the full GRC platform lifecycle. Ran stakeholder interviews across 6 BUs, built a prioritized backlog, ran Agile sprints, and made scope tradeoffs to protect the two highest-ROI deliverables: automated risk registers and real-time executive dashboards.",
    results: [
      "Reduced portfolio risk by 17% against pre-transformation baseline.",
      "Improved operational efficiency by 30% through automated workflow delivery.",
      "Reduced manual processes by 40% via strategic automation.",
      "Delivered real-time executive dashboard — live portfolio risk visibility for the first time.",
    ],
    fullDetails: [
      "Conducted stakeholder interviews across 6 business units to identify root causes beyond technology gaps.",
      "Defined product vision and multi-quarter roadmap with executive alignment.",
      "Owned full product backlog in Jira — user stories with acceptance criteria, prioritized by business value.",
      "Ran Agile sprints: planning, standups, reviews, retrospectives across a multi-quarter transformation.",
      "Made scope decisions to protect P0 deliverables — automated risk registers and executive dashboards.",
      "Presented product strategy and risk outcome metrics to executive leadership quarterly.",
    ],
  },

  {
    id: "huntington-risk",
    category: "Enterprise",
    title: "Unified Risk Management Integration",
    role: "Sr. GRC Product Owner",
    client: "Huntington National Bank",
    duration: "Aug 2016 - May 2022",

    summary: "Served as Sr. Product Owner for a major Archer GRC platform integration during a bank merger. Increased data security by 79%, data availability by 56%, and cut process time by 25% over a multi-year engagement.",
    techStack: ["Archer", "Agile/Scrum", "Data Analytics"],
    image: "/assets/images/huntington.png",
    coverImage: "/assets/images/huntington.png",
    slug: "unified-risk-management",

    situation: "A major bank merger created an immediate and dangerous data problem: two organizations with separate risk systems, separate data schemas, and separate processes now needed to operate as one. The result was data silos, security vulnerabilities, slow process times, and an inability to accurately assess the combined organization's risk posture. Leadership needed a unified view — and they needed it delivered without disrupting ongoing banking operations.",
    task: "As Sr. GRC Product Owner, I owned the product backlog and delivery roadmap for the integration of two legacy systems into a single unified Archer GRC platform. My role was to translate high-level business requirements from two previously separate organizations into a coherent product vision, manage the backlog, align competing stakeholders, and drive delivery across a multi-year Agile program.",
    action: [
      "Led discovery across both legacy organizations to map data structures, process differences, and stakeholder priorities — identifying where the two systems conflicted and where they complemented each other.",
      "Built and prioritized the integration backlog based on risk severity: data security gaps were addressed first, then availability gaps, then process optimization.",
      "Translated complex, sometimes conflicting requirements from two separate bank cultures into clear, actionable user stories with defined acceptance criteria.",
      "Championed a phased migration strategy that allowed the combined organization to operate during the transition — no big-bang cutover that could have disrupted banking operations.",
      "Conducted cost-benefit analysis on all major feature and architecture decisions — ensuring every backlog item could justify its development cost against measurable business outcomes.",
      "Maintained stakeholder alignment across both legacy organizations throughout a 6-year engagement — managing competing priorities, political dynamics, and conflicting legacy commitments.",
    ],
    outcome: [
      "Increased data security by 79% through the unified platform — eliminating the vulnerabilities created by operating two separate, disconnected systems.",
      "Boosted data availability by 56% — both organizations now had real-time access to unified risk data for the first time.",
      "Reduced process time by 25% for the platform implementation lifecycle.",
      "Successfully aligned two previously separate organizations on a single product vision and delivery roadmap over a 6-year engagement.",
    ],
    metrics: [
      { value: "79%",  label: "Data security increase" },
      { value: "56%",  label: "Data availability increase" },
      { value: "25%",  label: "Process time reduction" },
      { value: "6 yrs", label: "Multi-year PO engagement" },
    ],
    challenge: "A bank merger created dangerous data silos, security vulnerabilities, and operational fragmentation across two previously separate risk systems — making accurate risk assessment impossible for the combined organization.",
    solution: "Led discovery across both legacy organizations, built a risk-prioritized integration backlog, championed a phased migration strategy, and maintained stakeholder alignment across two separate bank cultures over a 6-year Agile program.",
    results: [
      "Increased data security by 79% by eliminating two-system vulnerabilities.",
      "Boosted data availability by 56% with real-time unified risk data access.",
      "Reduced process time by 25%.",
      "Aligned two merged organizations on a single product vision over a 6-year engagement.",
    ],
    fullDetails: [
      "Led discovery across both legacy organizations to map data structures, conflicts, and stakeholder priorities.",
      "Prioritized integration backlog by risk severity: security gaps first, availability second, process optimization third.",
      "Translated conflicting requirements from two bank cultures into clear user stories with acceptance criteria.",
      "Championed phased migration strategy to avoid big-bang cutover risks.",
      "Conducted cost-benefit analysis on all major feature and architecture decisions.",
      "Maintained cross-organizational stakeholder alignment throughout a 6-year Agile engagement.",
    ],
  },

  {
    id: "jpmc-agile",
    category: "Enterprise",
    title: "Agile Workflow Optimization",
    role: "Business Analyst / Project Coordinator",
    client: "JP Morgan Chase",
    duration: "Mar 2014 - Aug 2016",

    summary: "Managed Agile delivery at JP Morgan Chase. Coordinated 500+ scrum calls, translated 300+ business requirements into user stories, and served as the primary liaison between business and engineering.",
    techStack: ["Jira", "Visio", "Data Flow Diagrams"],
    image: "/assets/images/jpmorgan.png",
    coverImage: "/assets/images/jpmorgan.png",
    slug: "jpmc-agile",

    challenge: "Managing cross-functional teams across different locations led to communication gaps and potential delays in software enhancements.",
    solution: "Implemented a rigorous Agile framework, coordinating over 500 scrum calls to maintain alignment. Served as the primary liaison between business units and development teams.",
    results: [
      "Coordinated 500+ scrum calls ensuring 100% task completion on schedule.",
      "Interpreted data analytics to provide actionable strategies to upper management.",
      "Ensured timely delivery of software enhancements through effective sprint management.",
    ],
    fullDetails: [
      "Coordinated over 500 scrum calls and sprint activities to ensure schedule adherence.",
      "Managed and tracked progress throughout product lifecycle using Agile tools.",
      "Engaged stakeholders to gather requirements and define project scope.",
      "Translated business requirements into user stories, workflow diagrams, and data flows.",
      "Interpreted data analytics to develop actionable strategies for upper management.",
      "Liaised between business and development teams as primary point of contact.",
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

    challenge: "Large-scale system enhancements faced ambiguity in business needs, requiring precise alignment between organizational goals and technical capabilities.",
    solution: "Facilitated intensive requirements gathering workshops (70+ sessions) to elicit needs. Translated over 300 high-level requirements into detailed functional specifications.",
    results: [
      "Facilitated 70+ requirements gathering sessions to drive project clarity.",
      "Translated 300+ complex business requirements into actionable technical specs.",
      "Optimized data collection procedures to support executive decision-making.",
    ],
    fullDetails: [
      "Facilitated over 70 requirements gathering sessions to elicit business needs.",
      "Translated over 300 high-level business requirements into detailed functional specs.",
      "Coordinated development of project schedules and implementation plans.",
      "Managed project timelines and deliverables from initiation through launch.",
      "Optimized data collection and reporting procedures for decision-making.",
      "Identified system functionality gaps and recommended solutions.",
    ],
  },
];
