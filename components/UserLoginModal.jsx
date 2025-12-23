'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Key } from 'lucide-react';
import { sendOtp, verifyOtp } from '@/app/actions/user-auth';
import { useRouter } from 'next/navigation';

export default function UserLoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsMounted(false);
      setStep(1);
      setEmail('');
      setOtp('');
      setError('');
      setSuccess('');
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await sendOtp(email);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('OTP sent to your email!');
        setStep(2);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtp(email, otp);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('Login successful!');
        // Close modal
        onClose();
        // Hard refresh the page to load user data
        window.location.href = '/practice';
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    setStep(1);
    setError('');
    setSuccess('');
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target.className === 'modal-overlay') onClose();
      }}
    >
      <div
        className={`auth-container ${!isMounted ? 'hidden' : ''}`}
        style={{ opacity: isMounted ? 1 : 0, transform: isMounted ? 'scale(1)' : 'scale(0.95)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>

        <div className="content-wrapper">
          <h2 className="title">
            {step === 1 ? 'Student Login' : 'Enter OTP'}
          </h2>
          <p className="subtitle">
            {step === 1
              ? 'Enter your whitelisted college email to verify access.'
              : `We sent a code to ${email}. Please enter it below.`}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Student Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="error-msg">{error}</p>}
              {success && <p className="success-msg">{success}</p>}

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button type="button" onClick={handleBack} className="back-link" disabled={loading}>
                Change Email
              </button>
            </form>
          )}

          <p className="note">
            * Access is restricted to whitelisted students only.
          </p>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          padding: 2.5rem 2rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .title {
            color: white;
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.75rem;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            margin-bottom: 2rem;
            max-width: 90%;
            line-height: 1.5;
            font-weight: 400;
        }

        .auth-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .input-field {
            position: relative;
            width: 100%;
        }

        .input-field input {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 1rem;
            border-radius: 12px;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.3s ease;
            font-weight: 400;
        }

        .input-field input:focus {
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
        }

        .input-field input::placeholder {
            color: rgba(255, 255, 255, 0.4);
            font-weight: 400;
        }

        .btn {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 1rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
        }

        .btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .btn:active:not(:disabled) {
            transform: translateY(0px);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .error-msg {
            color: #ff6b6b;
            font-size: 0.85rem;
            background: rgba(255, 107, 107, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 107, 107, 0.2);
            font-weight: 400;
        }

        .success-msg {
            color: #51cf66;
            font-size: 0.85rem;
            background: rgba(81, 207, 102, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid rgba(81, 207, 102, 0.2);
            font-weight: 400;
        }

        .back-link {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.85rem;
            cursor: pointer;
            text-decoration: underline;
            margin-top: 0.5rem;
            transition: color 0.2s;
            font-weight: 400;
        }

        .back-link:hover {
            color: rgba(255, 255, 255, 0.8);
        }

        .note {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.4);
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            font-weight: 400;
        }

        .hidden {
            display: none;
        }
      `}</style>
    </div>
  );
}
