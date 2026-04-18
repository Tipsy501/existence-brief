import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="flex-1 bg-white py-24">
      <div className="container-max max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-serif italic">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-8 font-medium">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Last Updated: April 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They help us 
              provide essential functionality and improve your user experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Cookies</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential:</strong> These are required for system security and basic authentication (e.g., Supabase session management).</li>
              <li><strong>Preferences:</strong> We use cookies to remember your settings and theme preferences.</li>
              <li><strong>Analytics:</strong> Anonymous usage data helps us optimize our strategic framework.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Third-Party Cookies</h2>
            <p>
              We utilize strategic partners for essential services that may set their own cookies:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase:</strong> For authentication and secure data retrieval.</li>
              <li><strong>PayPal:</strong> To securely process premium lifecycle upgrades.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Please note that disabling 
              essential cookies may degrade the precision of your platform experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">5. Changes to This Policy</h2>
            <p>
              We may update this policy periodically to reflect changes in our tactical operations.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900">6. Contact Us</h2>
            <p>
              For any clarification regarding your data footprint: <br />
              <span className="text-indigo-600 font-bold">support@existencebrief.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
