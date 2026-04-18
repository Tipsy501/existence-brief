import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { confirmNewsletterSubscription } from '../lib/newsletter';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorHeader, setErrorHeader] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorHeader('Invalid Transmission Code');
      return;
    }

    async function confirm() {
      try {
        const result = await confirmNewsletterSubscription(token!);
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorHeader(result.error || 'Identity Verification Deviation');
        }
      } catch (err) {
        setStatus('error');
        setErrorHeader('Strategic Connection Error');
      }
    }

    confirm();
  }, [token]);

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card padding="lg" className="text-center shadow-xl shadow-slate-200">
          {status === 'loading' && (
            <div className="py-12">
              <LoadingSpinner text="Verifying Strategic Insertion..." />
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Protocol Synchronized</h2>
              <p className="text-slate-600 font-medium">
                Your enlistment is verified. You will now receive high-precision strategic tips every Monday morning.
              </p>
              <div className="pt-4">
                <Button to="/dashboard" fullWidth className="gap-2">
                  Access Dashboard <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 space-y-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Transmission Error</h2>
              <p className="text-slate-600 font-medium italic">
                {errorHeader}
              </p>
              <p className="text-slate-400 text-sm">
                The confirmation link may have expired or been improperly dispatched. Please re-subscribe from the dashboard.
              </p>
              <div className="pt-4">
                <Button variant="secondary" onClick={() => navigate('/')} fullWidth>
                  Return to Base
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
