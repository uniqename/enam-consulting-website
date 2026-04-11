import { useState } from 'react';
import { PenLine, Lock, FileText, ExternalLink } from 'lucide-react';
import SignatureGenerator from '../../features/landing/SignatureGenerator';

const docs = [
  {
    id: '08_Session_Fee_Agreement',
    title: 'Session Fee Agreement',
    desc: 'Non-refundable discovery & strategy session fee policy. Send before any paid session is confirmed.',
    tag: 'Client-facing',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: '09_Retainer_Agreement',
    title: 'Monthly Retainer Agreement',
    desc: 'Fractional PO & Fractional AI Officer engagements. 3-month minimum, monthly billing, IP ownership.',
    tag: 'Client-facing',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: '10_Change_Order_Form',
    title: 'Change Order / Scope Amendment',
    desc: 'Use when scope, timeline, or fees change mid-engagement. No new work begins without a signed CO.',
    tag: 'Mid-engagement',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: '11_Client_Intake_Form',
    title: 'Client Pre-Call Intake Form',
    desc: 'Send to the client 24–48 hours before a discovery or strategy session. Covers product, GRC, and AI tracks.',
    tag: 'Pre-call',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: '12_Onboarding_Welcome_And_Kickoff',
    title: 'Onboarding & Kickoff',
    desc: 'Welcome letter, access checklist, and 6-step kickoff agenda. Sent after the contract is signed.',
    tag: 'Onboarding',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: '13_Project_Closeout_Report',
    title: 'Project Closeout Report',
    desc: 'End-of-engagement summary: deliverables, metrics, handoff index, access revocation, and signatures.',
    tag: 'Close-out',
    tagColor: 'bg-stone-100 text-stone-600',
  },
];

const Tools = () => {
  const [showSig, setShowSig] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="w-full px-6 lg:px-16 max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <Lock size={16} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Internal Tools — Not Linked Publicly</span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-1">Doxa &amp; Co Tools</h1>
        <p className="text-stone-500 mb-12 text-sm">Only accessible via direct URL. Bookmark this page.</p>

        {/* ── Document Library ─────────────────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Consulting Document Library</h2>
              <p className="text-stone-500 text-sm">Click any document to open, fill in, sign, and export as PDF or Word.</p>
            </div>
          </div>

          <div className="bg-stone-100 border border-stone-200 rounded-2xl px-5 py-3 mb-6 text-sm text-stone-600 leading-relaxed">
            <strong className="text-stone-800">How to use:</strong> Open a document → click any field to type → click the signature area to draw your signature → hit <strong>Print / PDF</strong> to save as PDF, or <strong>Word (.docx)</strong> to download an editable Word file. Your edits are auto-saved in this browser.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {docs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${doc.tagColor} mb-2 inline-block`}>
                      {doc.tag}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">{doc.title}</h3>
                  </div>
                  <FileText size={18} className="text-stone-300 shrink-0 mt-1" />
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{doc.desc}</p>
                <div className="flex gap-3 mt-auto pt-2">
                  <a
                    href={`/docs/${doc.id}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <ExternalLink size={14} /> Open &amp; Edit
                  </a>
                  <a
                    href={`/docs/${doc.id}.docx`}
                    download
                    className="inline-flex items-center justify-center gap-1 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold px-4 py-2.5 rounded-xl border border-stone-200 transition-colors"
                  >
                    .docx
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email Signature Generator ────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
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
