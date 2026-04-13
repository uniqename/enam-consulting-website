const Privacy = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: April 2026</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">1. Information We Collect</h2>
            <p>When you use this website or contact Doxa &amp; Co, we may collect your name, email address, company name, and any information you voluntarily provide through contact forms or booking requests.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">2. How We Use Your Information</h2>
            <p>We use the information you provide solely to respond to inquiries, schedule consultations, and deliver services you have requested. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">3. Cookies</h2>
            <p>This site may use essential cookies to ensure proper functionality. We do not use tracking or advertising cookies. You can disable cookies in your browser settings at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">4. Data Retention</h2>
            <p>We retain your information only as long as necessary to fulfill the purpose for which it was collected, or as required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of any personal information we hold about you. To exercise these rights, contact us at <a href="mailto:consulting.enam@gmail.com" className="text-emerald-600 hover:underline">consulting.enam@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">6. Changes to This Policy</h2>
            <p>We may update this policy from time to time. The most current version will always be available at this URL.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">7. Contact</h2>
            <p>For any privacy-related questions, reach us at <a href="mailto:consulting.enam@gmail.com" className="text-emerald-600 hover:underline">consulting.enam@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
