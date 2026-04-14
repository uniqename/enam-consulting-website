const Terms = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Terms of Service</h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: April 2026</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">1. Services</h2>
            <p>Doxa &amp; Co provides product management consulting, fractional PO services, and strategic advisory. The specific scope, deliverables, timeline, and fees for any engagement are defined in a separate Statement of Work or consulting agreement signed by both parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">2. Payment Terms</h2>
            <p>Invoices are due within 14 days of the invoice date unless otherwise agreed in writing. Late payments may be subject to a 1.5% monthly interest charge. Project work does not begin until a signed agreement and initial payment (where applicable) are received.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">3. Intellectual Property</h2>
            <p>Upon receipt of full payment, clients receive full ownership of all deliverables produced specifically for their engagement. Doxa &amp; Co retains the right to use non-confidential project outcomes as portfolio references unless explicitly agreed otherwise.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">4. Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary or sensitive information shared during the engagement. This obligation survives the termination of the engagement for a period of two years.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">5. Cancellation & Refunds</h2>
            <p>Engagements may be cancelled with 14 days written notice. Work completed up to the cancellation date is billable. Prepaid fees for undelivered work will be refunded on a pro-rated basis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">6. Limitation of Liability</h2>
            <p>Doxa &amp; Co's liability for any claim arising from services provided is limited to the fees paid for the specific engagement giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">7. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Michigan, USA.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">8. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:consulting.enam@gmail.com" className="text-emerald-600 hover:underline">consulting.enam@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
