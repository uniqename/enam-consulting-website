import { useState } from "react";
import { X, Copy, CheckCircle2, Calendar } from "lucide-react";

const FORMATS = [
  {
    id: "long",
    label: "Long form",
    fmt: (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  },
  {
    id: "us",
    label: "US form",
    fmt: (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  },
  {
    id: "ordinal",
    label: "Ordinal",
    fmt: (d: Date) => {
      const n = d.getDate();
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      const ord = s[(v - 20) % 10] || s[v] || s[0];
      return `${n}${ord} ${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
    },
  },
  {
    id: "short",
    label: "Short (DD/MM/YYYY)",
    fmt: (d: Date) => d.toLocaleDateString("en-GB"),
  },
  {
    id: "iso",
    label: "ISO 8601",
    fmt: (d: Date) => d.toISOString().split("T")[0],
  },
  {
    id: "month",
    label: "Month + Year",
    fmt: (d: Date) => d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
  },
];

interface Props { onClose: () => void; }

export default function DateGenerator({ onClose }: Props) {
  const todayIso = new Date().toISOString().split("T")[0];
  const [dateVal, setDateVal] = useState(todayIso);
  const [copied, setCopied] = useState<string | null>(null);

  const date = new Date(dateVal + "T12:00:00");

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X size={17} />
        </button>

        <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-stone-100">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Date Generator</h2>
            <p className="text-sm text-stone-500">Pick a date · copy any format</p>
          </div>
        </div>

        <div className="px-8 py-6">
          <input
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <div className="space-y-2">
            {FORMATS.map(({ id, label, fmt }) => {
              const text = fmt(date);
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 hover:bg-amber-50 hover:border-amber-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-stone-900 truncate">{text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(text, id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      copied === id
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700"
                    }`}
                  >
                    {copied === id ? (
                      <><CheckCircle2 size={12} /> Copied</>
                    ) : (
                      <><Copy size={12} /> Copy</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-stone-400 text-center mt-5">
            To stamp a date onto a document, use <strong>Document Converter</strong> → Place Date.
          </p>
        </div>
      </div>
    </div>
  );
}
