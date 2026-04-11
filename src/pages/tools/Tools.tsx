import { useState } from 'react';
import { PenLine, Lock } from 'lucide-react';
import SignatureGenerator from '../../features/landing/SignatureGenerator';

const Tools = () => {
  const [showSig, setShowSig] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="w-full px-6 lg:px-16 max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-2">
          <Lock size={16} className="text-stone-400" />
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Internal Tools — Not Linked Publicly</span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Doxa &amp; Co Tools</h1>
        <p className="text-stone-500 mb-12 text-sm">This page is only accessible if you know the URL. Bookmark it.</p>

        <div className="grid grid-cols-1 gap-6">

          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-white">
                <PenLine size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">Email Signature Generator</h2>
                <p className="text-stone-500 text-sm">Generate a branded HTML email signature for Gmail, Outlook, or Apple Mail.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSig(true)}
              className="mt-2 inline-flex items-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
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
