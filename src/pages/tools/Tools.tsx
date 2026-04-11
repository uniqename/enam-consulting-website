import { useState } from 'react';
import { PenLine, Lock, FileText, ExternalLink, Download } from 'lucide-react';
import SignatureGenerator from '../../features/landing/SignatureGenerator';

type Doc = {
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  html?: string;   // path to editable HTML version
  docx?: string;   // path to .docx download
};

const phases: { label: string; docs: Doc[] }[] = [
  {
    label: 'Before the Engagement',
    docs: [
      {
        title: 'Letterhead Template',
        desc: 'Branded letterhead for formal correspondence, proposals, and printed documents.',
        tag: 'Template',
        tagColor: 'bg-stone-100 text-stone-600',
        html: '/docs/Doxa_Letterhead_Template.html',
        docx: '/docs/Doxa_Letterhead_Template.docx',
      },
      {
        title: 'Services & Pricing',
        desc: 'Full service menu with pricing tiers. Share with prospects who ask "what do you offer?"',
        tag: 'Client-facing',
        tagColor: 'bg-emerald-100 text-emerald-700',
        html: '/docs/Doxa_Services_Pricing.html',
        docx: '/docs/Doxa_Services_Pricing.docx',
      },
      {
        title: 'Client Pre-Call Intake Form',
        desc: 'Send to the client 24–48 hours before a discovery or strategy session. Covers product, GRC, and AI tracks.',
        tag: 'Pre-call',
        tagColor: 'bg-blue-100 text-blue-700',
        html: '/docs/11_Client_Intake_Form.html',
        docx: '/docs/11_Client_Intake_Form.docx',
      },
      {
        title: 'Session Fee Agreement',
        desc: 'Non-refundable discovery & strategy session fee policy. Send before any paid session is confirmed.',
        tag: 'Client-facing',
        tagColor: 'bg-emerald-100 text-emerald-700',
        html: '/docs/08_Session_Fee_Agreement.html',
        docx: '/docs/08_Session_Fee_Agreement.docx',
      },
      {
        title: 'Discovery Call Brief',
        desc: 'Internal preparation guide for discovery calls — goals, questions, and talking points.',
        tag: 'Internal',
        tagColor: 'bg-stone-100 text-stone-600',
        html: '/docs/Doxa_Discovery_Brief.html',
        docx: '/docs/Doxa_Discovery_Brief.docx',
      },
    ],
  },
  {
    label: 'Signing & Kickoff',
    docs: [
      {
        title: 'Project Proposal',
        desc: 'Structured proposal template: problem statement, approach, deliverables, timeline, and investment.',
        tag: 'Client-facing',
        tagColor: 'bg-emerald-100 text-emerald-700',
        html: '/docs/Doxa_Project_Proposal.html',
        docx: '/docs/Doxa_Project_Proposal.docx',
      },
      {
        title: 'Consulting Agreement',
        desc: 'Master services agreement covering IP, confidentiality, payment, and scope. Sign before any work begins.',
        tag: 'Legal',
        tagColor: 'bg-red-100 text-red-700',
        html: '/docs/Doxa_Consulting_Agreement.html',
        docx: '/docs/Doxa_Consulting_Agreement.docx',
      },
      {
        title: 'Statement of Work (SOW)',
        desc: 'Defines exactly what will be delivered, when, and for how much. Attaches to the consulting agreement.',
        tag: 'Legal',
        tagColor: 'bg-red-100 text-red-700',
        html: '/docs/Doxa_Statement_of_Work.html',
        docx: '/docs/Doxa_Statement_of_Work.docx',
      },
      {
        title: 'Monthly Retainer Agreement',
        desc: 'Fractional PO & AI Officer engagements. 3-month minimum, monthly billing, IP ownership, termination terms.',
        tag: 'Legal',
        tagColor: 'bg-red-100 text-red-700',
        html: '/docs/09_Retainer_Agreement.html',
        docx: '/docs/09_Retainer_Agreement.docx',
      },
      {
        title: 'Onboarding & Kickoff',
        desc: 'Welcome letter, access checklist, and 6-step kickoff agenda. Sent after the contract is signed.',
        tag: 'Onboarding',
        tagColor: 'bg-purple-100 text-purple-700',
        html: '/docs/12_Onboarding_Welcome_And_Kickoff.html',
        docx: '/docs/12_Onboarding_Welcome_And_Kickoff.docx',
      },
    ],
  },
  {
    label: 'During the Engagement',
    docs: [
      {
        title: 'Change Order / Scope Amendment',
        desc: 'Use when scope, timeline, or fees change mid-engagement. No new work begins without a signed CO.',
        tag: 'Mid-engagement',
        tagColor: 'bg-amber-100 text-amber-700',
        html: '/docs/10_Change_Order_Form.html',
        docx: '/docs/10_Change_Order_Form.docx',
      },
      {
        title: 'Invoice Template',
        desc: 'Branded invoice for milestone payments, monthly retainers, and session fees.',
        tag: 'Billing',
        tagColor: 'bg-amber-100 text-amber-700',
        html: '/docs/Doxa_Invoice_Template.html',
        docx: '/docs/Doxa_Invoice_Template.docx',
      },
    ],
  },
  {
    label: 'Closing Out',
    docs: [
      {
        title: 'Project Closeout Report',
        desc: 'End-of-engagement summary: deliverables status, metrics, handoff index, access revocation, and signatures.',
        tag: 'Close-out',
        tagColor: 'bg-stone-100 text-stone-600',
        html: '/docs/13_Project_Closeout_Report.html',
        docx: '/docs/13_Project_Closeout_Report.docx',
      },
    ],
  },
  {
    label: 'Reference',
    docs: [
      {
        title: 'Website Audit Report — Rev. 3',
        desc: 'Full audit of doxaandco.co with scoring, findings, resolved items, and priority action matrix.',
        tag: 'Internal',
        tagColor: 'bg-stone-100 text-stone-600',
        html: '/docs/00_Website_Audit_Report.html',
        docx: '/docs/14_Website_Audit_Rev3_FreshEyes.docx',
      },
    ],
  },
];

const DocCard = ({ doc }: { doc: Doc }) => (
  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${doc.tagColor} mb-2 inline-block`}>
          {doc.tag}
        </span>
        <h3 className="font-bold text-stone-900 text-base leading-snug">{doc.title}</h3>
      </div>
      <FileText size={18} className="text-stone-300 shrink-0 mt-1" />
    </div>
    <p className="text-stone-500 text-sm leading-relaxed flex-1">{doc.desc}</p>
    <div className="flex gap-3 pt-1">
      {doc.html ? (
        <a
          href={doc.html}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <ExternalLink size={14} /> Open &amp; Edit
        </a>
      ) : (
        <div className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-400 text-sm font-bold px-4 py-2.5 rounded-xl cursor-default select-none">
          Word only
        </div>
      )}
      {doc.docx && (
        <a
          href={doc.docx}
          download
          className="inline-flex items-center justify-center gap-1 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold px-4 py-2.5 rounded-xl border border-stone-200 transition-colors"
          title="Download Word file"
        >
          <Download size={13} />
        </a>
      )}
    </div>
  </div>
);

const Tools = () => {
  const [showSig, setShowSig] = useState(false);
  const totalDocs = phases.reduce((n, p) => n + p.docs.length, 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="w-full px-6 lg:px-16 max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <Lock size={16} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Internal Tools — Not Linked Publicly</span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-1">Doxa &amp; Co Tools</h1>
        <p className="text-stone-500 mb-10 text-sm">Only accessible via direct URL. Bookmark this page.</p>

        {/* ── Document Library ─────────────────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Consulting Document Library</h2>
              <p className="text-stone-500 text-sm">{totalDocs} documents · organized by engagement phase</p>
            </div>
          </div>

          <div className="bg-stone-100 border border-stone-200 rounded-2xl px-5 py-3 mb-8 text-sm text-stone-600 leading-relaxed">
            <strong className="text-stone-800">How to use:</strong> Documents with <strong>Open &amp; Edit</strong> open in the browser — click any field to type, click signature lines to draw your signature, then hit <strong>Print / PDF</strong> to save as PDF or <strong>⬇</strong> to download as Word. Edits auto-save in this browser. Documents marked <em>Word only</em> are download-and-edit in Word or Pages.
          </div>

          <div className="space-y-10">
            {phases.map((phase) => (
              <div key={phase.label}>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 pl-1">
                  {phase.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.docs.map((doc) => (
                    <DocCard key={doc.title} doc={doc} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email Signature Generator ────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shrink-0">
              <PenLine size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Email Signature Generator</h2>
              <p className="text-stone-500 text-sm">Generate a branded HTML email signature for Gmail, Outlook, or Apple Mail.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <button
              type="button"
              onClick={() => setShowSig(true)}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <PenLine size={16} /> Open Signature Generator
            </button>
          </div>
        </div>

      </div>

      {showSig && <SignatureGenerator onClose={() => setShowSig(false)} />}
    </div>
  );
};

export default Tools;
