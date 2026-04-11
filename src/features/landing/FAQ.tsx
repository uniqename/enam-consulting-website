import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';

const faqs = [
  {
    q: 'Are you looking for full-time roles or only consulting?',
    a: "Both — and I'm open about that. I'm actively available for full-time Senior PM or Director of Product roles. I also take on consulting engagements (Fractional PO, MVP builds, GRC transformation) in parallel. If you're a recruiter or hiring manager, the best starting point is a 30-minute call.",
  },
  {
    q: 'What does a Fractional PO engagement actually look like week-to-week?',
    a: 'Typically: a sprint planning session on Monday, async backlog grooming mid-week, a sprint review/retro on Friday, and ad hoc stakeholder alignment as needed. I embed in your Jira, Slack, and standups — I work inside your team, not above it. Engagements are month-to-month with a 30-day notice period.',
  },
  {
    q: 'Do you work with early-stage startups or only enterprise?',
    a: "Both. The Beacon app was built in 8 weeks for a non-profit with zero budget. HomeLinkGH was bootstrapped from scratch. Comerica and Huntington are Fortune 500 banks. The common thread is a clear problem to solve — I adapt to the context, not the other way around. That said, I'm most effective when there's a real backlog to own, not just advisory.",
  },
  {
    q: 'Can you build the product AND manage the product backlog?',
    a: "Yes — that's the unusual part. Most PMs can't write production code, and most developers can't run a sprint. I've done both across multiple shipped products. For smaller engagements, I often serve as both PM and developer. For larger ones, I focus on the PO role and coordinate with your engineering team.",
  },
  {
    q: 'What industries do you have the most experience in?',
    a: 'Financial services / GRC (10+ years at Huntington, Comerica, JP Morgan, Target), marketplace platforms (HomeLinkGH — two-sided B2B/B2C marketplace), and mission-driven tech (Beacon — privacy-first crisis app, FaithKlinik — SaaS church management). I have a strong track record in regulated environments where compliance and delivery velocity have to coexist.',
  },
  {
    q: 'How quickly can you start?',
    a: "For fractional or consulting engagements: typically within 1–2 weeks of a signed agreement. For full-time roles: flexible, but I can start relatively quickly. The first two weeks of any engagement are always discovery — I won't commit to a roadmap until I understand the actual problem.",
  },
  {
    q: 'Do you require long-term commitments?',
    a: 'No. MVP Development is fixed-scope and milestone-billed. Enterprise GRC consulting is engagement-based with a defined SOW. Fractional PO is month-to-month with 30 days notice. I prefer relationships that last because the work is good — not because you\'re locked in.',
  },
  {
    q: 'How does payment work, and what are the fees involved?',
    a: "Invoices are due within 7 days of issue. Late payments accrue 1.5% per month. For strategy calls and MVP scoping sessions, a non-refundable session fee ($250–$500 depending on scope) is collected before the call — this is credited toward your project if you move forward within 30 days. Milestone-based projects are split 50% upfront / 50% on delivery. Retainers are billed monthly in advance. All fees are outlined in the SOW before any work begins — no surprise invoices.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-stone-50 border-t border-stone-100 w-full">
      <div className="w-full px-6 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 text-center">Common Questions</h2>
          <p className="text-stone-500 text-center mb-12">Things people usually ask before reaching out.</p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  aria-expanded={open === i}
                >
                  <span className="font-bold text-stone-900 leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-stone-400 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {open === i && (
                  <div className="px-8 pb-6">
                    <p className="text-stone-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-500 mb-4">Still have questions?</p>
            <Link
              to="/booking"
              className="inline-flex items-center px-8 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-emerald-600 transition-colors"
            >
              Book a Free 30-Min Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
