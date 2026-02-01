'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed! Check your email to confirm.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#46b94e]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#46b94e]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Subscribe to Newsletter</h3>
            </div>
            
            <p className="text-white/60 mb-6">
                Get the latest blog posts delivered to your inbox every week.  No spam, unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={status === 'loading' || status === 'success'}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#46b94e]/50 focus:ring-2 focus:ring-[#46b94e]/20 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="px-6 py-3 bg-[#46b94e] hover:bg-[#3a9a40] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : status === 'success' ? (
                            <>
                                <Check className="w-4 h-4" />
                                Subscribed! 
                            </>
                        ) : (
                            'Subscribe'
                        )}
                    </button>
                </div>

                {message && (
                    <p className={`text-sm ${status === 'success' ?  'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}