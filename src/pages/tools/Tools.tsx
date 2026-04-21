import { useState } from 'react';
import { PenLine, Lock, FileText, ExternalLink, FileScan, Calendar } from 'lucide-react';
import SignatureGenerator from '../../features/landing/SignatureGenerator';
import DocConverterModal from '../../features/landing/DocConverterModal';
import DateGenerator from '../../features/landing/DateGenerator';

const DOC_CATEGORIES = [
  {
    label: 'Client Agreements',
    docs: [
      { name: 'Consulting Agreement', file: 'Doxa_Consulting_Agreement.html' },
      { name: 'Statement of Work', file: 'Doxa_Statement_of_Work.html' },
      { name: 'Session Fee Agreement', file: '08_Session_Fee_Agreement.html' },
      { name: 'Retainer Agreement', file: '09_Retainer_Agreement.html' },
      { name: 'Change Order Form', file: '10_Change_Order_Form.html' },
    ],
  },
  {
    label: 'Client Intake & Onboarding',
    docs: [
      { name: 'Client Intake Form', file: '11_Client_Intake_Form.html' },
      { name: 'Onboarding Welcome & Kickoff', file: '12_Onboarding_Welcome_And_Kickoff.html' },
      { name: 'Discovery Brief', file: 'Doxa_Discovery_Brief.html' },
      { name: 'Project Closeout Report', file: '13_Project_Closeout_Report.html' },
    ],
  },
  {
    label: 'Proposals & Pricing',
    docs: [
      { name: 'Project Proposal', file: 'Doxa_Project_Proposal.html' },
      { name: 'Services & Pricing', file: 'Doxa_Services_Pricing.html' },
      { name: 'Website Packages', file: 'Doxa_Website_Packages.html' },
      { name: 'Website Scope Explainer', file: 'Doxa_Website_Scope_Explainer.html' },
    ],
  },
  {
    label: 'Templates',
    docs: [
      { name: 'Letterhead Template', file: 'Doxa_Letterhead_Template.html' },
      { name: 'Invoice Template', file: 'Doxa_Invoice_Template.html' },
    ],
  },
  {
    label: 'Internal',
    docs: [
      { name: 'Website Audit Report', file: '00_Website_Audit_Report.html' },
    ],
  },
];

const Tools = () => {
  const [showSig, setShowSig] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showDate, setShowDate] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="w-full px-6 lg:px-16 max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <Lock size={16} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Internal — Not Linked Publicly</span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Doxa &amp; Co Tools</h1>
        <p className="text-stone-500 mb-12 text-sm">Bookmark this URL. It is not linked from anywhere public.</p>

        {/* Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">

          {/* Document Converter */}
          <div className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <FileScan size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Document Converter</h2>
                <p className="text-stone-400 text-xs mt-0.5">Upload PDF or Word, add letterhead, sign, edit, save or print.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowConverter(true)}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-stone-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <FileScan size={14} /> Open Converter
            </button>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center text-white">
                <PenLine size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Signature Generator</h2>
                <p className="text-stone-400 text-xs mt-0.5">Branded HTML email signature for Gmail, Outlook, Apple Mail.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSig(true)}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <PenLine size={14} /> Open Generator
            </button>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                <Calendar size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Date Generator</h2>
                <p className="text-stone-400 text-xs mt-0.5">Pick a date and copy in any format — Long, US, ISO, ordinal, and more.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDate(true)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-stone-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <Calendar size={14} /> Open Date Tool
            </button>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Document Library</h2>
                <p className="text-stone-400 text-xs mt-0.5">Open any document to edit in-browser, then print or save as PDF.</p>
              </div>
            </div>
            <p className="text-stone-400 text-xs">All documents below ↓</p>
          </div>
        </div>

        {/* Document Library */}
        <h2 className="text-xl font-bold text-stone-900 mb-1">Documents</h2>
        <p className="text-stone-400 text-sm mb-8">Open to edit directly in your browser. Print or save as PDF when done.</p>

        <div className="space-y-8">
          {DOC_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">{cat.label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.docs.map((doc) => (
                  <a
                    key={doc.file}
                    href={`/docs/${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-stone-100 rounded-xl px-5 py-4 flex items-center justify-between gap-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={16} className="text-stone-300 group-hover:text-emerald-600 flex-shrink-0 transition-colors" />
                      <span className="text-sm font-medium text-stone-700 truncate">{doc.name}</span>
                    </div>
                    <ExternalLink size={14} className="text-stone-300 group-hover:text-emerald-600 flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSig && <SignatureGenerator onClose={() => setShowSig(false)} />}
      {showConverter && <DocConverterModal onClose={() => setShowConverter(false)} />}
      {showDate && <DateGenerator onClose={() => setShowDate(false)} />}
    </div>
  );
};

export default Tools;
