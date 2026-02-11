import { BarChart, Brain, Cpu, Users } from "lucide-react";


export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  duration: string;
  features: string[];
  calendlyLink: string;
  isPopular?: boolean;
}


export const educationData = [
  {
    degree: "Master of Science in Data Science",
    school: "Regis University",
    location: "Denver, CO",
    year: "2019",
  },
  {
    degree: "Bachelor's Degree",
    school: "Arizona State University",
    location: "Tempe, AZ",
    year: "2010",
  }
];

export const certifications = [
  "Project Management Professional (PMP)",
  "Certified Scrum Master (CSM) / Agile Certified Practitioner",
  "Business Analysis Certification",
  "RSA Archer Certified Professional"
];

export const competencies = [
  {
    title: "Project & Product Management",
    icon: BarChart,
    skills: [
      "Project Leadership & Team Management",
      "Product Lifecycle Management",
      "Agile/Scrum Methodology (Certified Scrum Master)",
      "Sprint Planning & Backlog Management",
      "Roadmap Development & Prioritization",
      "Stakeholder Management & Communication",
      "Budget & Resource Management",
      "Risk Management & Mitigation Strategies"
    ]
  },
  {
    title: "Business & Strategic Planning",
    icon: Brain,
    skills: [
      "Business Requirements Gathering & Analysis",
      "Strategic Planning & Goal Setting",
      "Process Improvement & Optimization",
      "Change Management",
      "Vendor & Third-Party Management",
      "Business Case Development",
      "KPI Development & Performance Tracking"
    ]
  },
  {
    title: "Technical Acumen",
    icon: Cpu,
    skills: [
      "Enterprise Software Implementation (Archer, Salesforce, Jira)",
      "System Integration & API Management",
      "Data Analytics & Visualization (Tableau, SQL)",
      "GRC Platform Implementation",
      "Technology Solutions Architecture",
      "User Acceptance Testing (UAT)"
    ]
  },
  {
    title: "Leadership & Collaboration",
    icon: Users,
    skills: [
      "Cross-functional Team Leadership",
      "Executive Stakeholder Presentations",
      "Training & User Adoption Programs",
      "Conflict Resolution",
      "Critical Thinking & Problem Solving",
      "Agile Coaching & Mentorship"
    ]
  }
];