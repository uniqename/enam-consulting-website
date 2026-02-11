import type { ServicePackage } from "./data";

export const servicesData: ServicePackage[] = [
  {
    id: 'strategy-session',
    title: 'GRC Strategy & Roadmap',
    price: '$350',
    duration: '60 Minutes',
    features: [
      'Current State Assessment',
      'Risk & Compliance Gap Analysis',
      'Archer/Tooling Recommendations',
      'High-level Roadmap Draft'
    ],
    calendlyLink: 'https://calendly.com/enamegyir/strategy',
    isPopular: false
  },
  {
    id: 'agile-coaching',
    title: 'Agile Transformation Audit',
    price: '$750',
    duration: '90 Minutes + Report',
    features: [
      'Deep Dive into Sprint Processes',
      'Backlog Management Review',
      'Stakeholder Communication Plan',
      'Actionable "Fix-It" Report'
    ],
    calendlyLink: 'https://calendly.com/enamegyir/audit',
    isPopular: true // Highlight this as the "Best Value"
  },
  {
    id: 'retainer',
    title: 'Fractional Product Owner',
    price: 'Custom',
    duration: 'Monthly Retainer',
    features: [
      'End-to-End Product Lifecycle Management',
      'Executive Stakeholder Presentations',
      'Vendor & Third-Party Management',
      'Weekly Priority Alignment'
    ],
    calendlyLink: 'https://calendly.com/enamegyir/retainer',
    isPopular: false
  }
];