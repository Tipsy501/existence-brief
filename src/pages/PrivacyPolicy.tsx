import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 bg-white py-24">
      <div className="container-max max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-serif italic">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-8 font-medium">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Last Updated: April 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Data Collection & Logic</h2>
            <p>At Existence Brief, we prioritize your strategic privacy. We collect minimal tactical data required to provide your precision briefs, including your email and the scenarios you provide for analysis.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Supabase Integration</h2>
            <p>We utilize Supabase for robust, banking-grade authentication and data storage. Your strategic scenarios are stored in an encrypted tactical vault, accessible only to your authenticated account ID.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. User Rights</h2>
            <p>You maintain full ownership of your strategic insights. You have the right to access, export, or delete your data at any time through your dashboard settings.</p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900">4. Contact & Deletion</h2>
            <p>For data deletion requests or privacy inquiries, contact our protocol lead at: <br />
            <span className="text-indigo-600 font-bold">support@existencebrief.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
