import { Link } from 'react-router';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Terms of Service</h1>
          <p className="text-stone-500 text-sm">Last updated: April 2026 · Doxa and Co LLC</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">1. Agreement to Terms</h2>
            <p>By accessing doxaandco.co or engaging Doxa and Co LLC ("Doxa & Co") for consulting services, you agree to these Terms of Service. If you do not agree, please do not use this site or our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">2. Services</h2>
            <p>Doxa & Co provides technology consulting services including Enterprise GRC consulting, MVP development, Fractional Product Owner engagements, and AI Transformation Advisory. Specific terms for each engagement are governed by a signed Consulting Agreement and Statement of Work, which take precedence over these general terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">3. Session Fees</h2>
            <p>Certain consulting session types require a non-refundable session fee paid at the time of booking. Session fees are credited toward a signed engagement if the client proceeds within 30 days. Session fees are not refundable if the client cancels within 24 hours of the scheduled session, does not attend, or attends but does not proceed to a signed engagement. Full session fee terms are provided in the Session Fee Agreement sent at the time of booking.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">4. Intellectual Property</h2>
            <p><strong className="text-stone-900">Site content:</strong> All content on doxaandco.co — including text, design, graphics, and code — is the property of Doxa and Co LLC. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
            <p className="mt-3"><strong className="text-stone-900">Client deliverables:</strong> Work product created specifically for a client under a signed agreement becomes the client's property upon full payment. Doxa & Co retains the right to reference the engagement in portfolio materials unless the client requests confidentiality in writing.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">5. Confidentiality</h2>
            <p>Doxa & Co treats all client information shared during discovery calls, sessions, and engagements as confidential. We do not share client-specific business information with third parties. Clients may request a separate NDA before sharing sensitive information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">6. Limitation of Liability</h2>
            <p>Doxa & Co's total liability for any claim arising from services provided shall not exceed the fees paid for the specific engagement giving rise to the claim. We are not liable for indirect, consequential, or speculative damages. Consulting outcomes depend on factors outside our control including client execution, organizational decisions, and market conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">7. No Guarantee of Results</h2>
            <p>Doxa & Co provides professional consulting services based on experience and best practices. We do not guarantee specific business outcomes. Past results (including metrics cited in our portfolio) reflect specific client circumstances and should not be interpreted as guaranteed outcomes for future engagements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">8. Payment Terms</h2>
            <p>All invoices are due within 7 days of issue unless otherwise specified in a signed agreement. Late payments are subject to a 1.5% monthly late fee after 7 days. Doxa & Co reserves the right to suspend services for accounts more than 14 days overdue.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Ohio. Any disputes shall first be attempted to be resolved through good-faith mediation before pursuing formal legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">10. Contact</h2>
            <p>Questions about these terms: <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">ename@doxaandco.co</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-100 flex gap-6 text-sm">
          <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
          <Link to="/" className="text-stone-500 hover:text-stone-900">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
