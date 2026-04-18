import React from 'react';

export default function TermsOfService() {
  return (
    <div className="flex-1 bg-white py-24">
      <div className="container-max max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-serif italic">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-8 font-medium">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Last Updated: April 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Strategic Use</h2>
            <p>By using Existence Brief, you agree to our strategic operating principles. The briefs generated are for informational and planning purposes. Final tactical execution is the responsibility of the strategic engineer (you).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Premium Upgrades</h2>
            <p>Premium access is a one-time lifetime investment. All payments processed via PayPal are non-refundable after the 30-day clarity assurance period. Manual upgrades require email verification of receipt.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Content Ownership</h2>
            <p>You retain the intellectual property of the scenarios you input. Existence Brief retains ownership of the proprietary analysis framework and roadmap generation logic used to process your data.</p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>Existence Brief and TopZero Group are not liable for outcomes resulting from your tactical implementation of generated strategies.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
