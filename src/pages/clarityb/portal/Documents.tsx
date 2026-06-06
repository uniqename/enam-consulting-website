import { FileText, Download } from 'lucide-react';

export default function Documents() {
  const documents = [
    { name: 'Operations Audit Report', type: 'PDF', category: 'Reports', date: '2026-05-20' },
    { name: 'Business Continuity SOP', type: 'DOCX', category: 'SOPs', date: '2026-05-15' },
    { name: 'Financial Health Score', type: 'PDF', category: 'Reports', date: '2026-05-10' },
  ];

  const categories = ['All', 'SOPs', 'Reports', 'Agreements', 'Templates'];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Document Library</h1>
        <p className="text-stone-600">SOPs, reports, and deliverables</p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              cat === 'All'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-900 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{doc.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{doc.type}</p>
                  </div>
                </div>
              </div>
              <div className="mb-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-600 mb-2">
                  <span className="font-semibold">{doc.category}</span> • {doc.date}
                </p>
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-sm transition-colors"
              >
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600 mb-4">No documents yet.</p>
          <p className="text-stone-500 text-sm">Your consultant will add documents and deliverables as your engagement progresses.</p>
        </div>
      )}
    </div>
  );
}
