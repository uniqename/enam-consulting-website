import { Link } from 'react-router';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Privacy Policy</h1>
          <p className="text-stone-500 text-sm">Last updated: April 2026 · Doxa and Co LLC</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">1. Who We Are</h2>
            <p>Doxa and Co LLC ("Doxa & Co," "we," "us") is a technology consulting firm operated by Enam Egyir, based in Columbus, Ohio. This privacy policy covers the website at doxaandco.co and any related services.</p>
            <p className="mt-3">Contact: <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">ename@doxaandco.co</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">2. Information We Collect</h2>
            <p><strong className="text-stone-900">Contact form:</strong> When you submit the contact form, we collect your name, email address, company name, and message. This information is used solely to respond to your inquiry.</p>
            <p className="mt-3"><strong className="text-stone-900">Booking sessions:</strong> When you book a session, we collect your name, email, company, and selected meeting details. We use this to confirm your booking and prepare for your session.</p>
            <p className="mt-3"><strong className="text-stone-900">Analytics:</strong> This site may use standard web analytics (e.g., page views, session duration). No personally identifiable information is collected through analytics.</p>
            <p className="mt-3"><strong className="text-stone-900">Cookies:</strong> This site uses minimal cookies necessary for basic site function. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to inquiries submitted through the contact form</li>
              <li>To confirm and prepare for booked consulting sessions</li>
              <li>To send session-related communications (confirmation, follow-up summary, invoices)</li>
              <li>To improve the website and understand how visitors interact with it</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">4. Data Storage & Retention</h2>
            <p>Contact form submissions are processed through Netlify Forms and stored in Netlify's infrastructure. Session booking data is maintained in our internal records. We retain contact and session data for up to 3 years to support ongoing client relationships and comply with standard business record-keeping requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">5. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of any personal information we hold about you by emailing <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">ename@doxaandco.co</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">6. Security</h2>
            <p>This site is served over HTTPS. We take reasonable precautions to protect information submitted through this site, but no internet transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">7. Third-Party Services</h2>
            <p>This site is hosted on Netlify (netlify.com). Form submissions are processed through Netlify Forms. These services have their own privacy policies which govern data processed on their platforms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy periodically. Material changes will be noted with an updated "Last updated" date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">9. Contact</h2>
            <p>Questions about this policy: <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">ename@doxaandco.co</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-100 flex gap-6 text-sm">
          <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
          <Link to="/" className="text-stone-500 hover:text-stone-900">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
