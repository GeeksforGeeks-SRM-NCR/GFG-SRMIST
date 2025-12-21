'use client';

import { useState, useEffect } from 'react';

export default function UserLogin() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerName: '',
    registerEmail: '',
    registerPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState({});

  useEffect(() => {
    setIsMounted(true);
    // Allow a small buffer for the initial paint to settle before enabling child transitions
    setTimeout(() => setIsReady(true), 600);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName, value) => {
    if (!value) {
      setFocusedField(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.loginEmail.trim()) {
      newErrors.loginEmail = 'Email is required';
    } else if (!validateEmail(formData.loginEmail)) {
      newErrors.loginEmail = 'Invalid email format';
    }

    if (!formData.loginPassword) {
      newErrors.loginPassword = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Login successful!');
    console.log('Login:', { email: formData.loginEmail, password: formData.loginPassword });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.registerName.trim()) {
      newErrors.registerName = 'Name is required';
    }

    if (!formData.registerEmail.trim()) {
      newErrors.registerEmail = 'Email is required';
    } else if (!validateEmail(formData.registerEmail)) {
      newErrors.registerEmail = 'Invalid email format';
    }

    if (!formData.registerPassword) {
      newErrors.registerPassword = 'Password is required';
    } else if (formData.registerPassword.length < 8) {
      newErrors.registerPassword = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Account created successfully!');
    console.log('Register:', { name: formData.registerName, email: formData.registerEmail, password: formData.registerPassword });
  };

  return (
    <div className="auth-wrapper">
      <div
        className={`auth-container ${!isMounted ? 'no-transition' : ''} ${!isReady ? 'prevent-child-transitions' : ''} ${isRegisterMode ? 'register-active' : ''}`}
        style={{ opacity: isMounted ? 1 : 0, visibility: isMounted ? 'visible' : 'hidden' }}
      >

        {/* Form Container - Slides left/right */}
        <div className="forms-container">
          <div className="signin-signup">

            {/* Login Form */}
            <form onSubmit={handleLogin} className="sign-in-form">
              <h2 className="title">Login</h2>

              <div className="input-field-wrapper">
                <div className="input-field">
                  <input
                    type="email"
                    name="loginEmail"
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('loginEmail')}
                    onBlur={(e) => handleBlur('loginEmail', e.target.value)}
                    className={errors.loginEmail ? 'error' : ''}
                    required
                  />
                  <label className={focusedField.loginEmail || formData.loginEmail ? 'active' : ''}>
                    Email
                  </label>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                </div>
                {errors.loginEmail && <span className="error-message">{errors.loginEmail}</span>}
              </div>

              <div className="input-field-wrapper">
                <div className="input-field">
                  <input
                    type="password"
                    name="loginPassword"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('loginPassword')}
                    onBlur={(e) => handleBlur('loginPassword', e.target.value)}
                    className={errors.loginPassword ? 'error' : ''}
                    required
                  />
                  <label className={focusedField.loginPassword || formData.loginPassword ? 'active' : ''}>
                    Password
                  </label>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                </div>
                {errors.loginPassword && <span className="error-message">{errors.loginPassword}</span>}
              </div>

              <button type="submit" className="btn solid">Login</button>

              <p className="toggle-text">
                Don't have an account?
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => setIsRegisterMode(true)}
                >
                  Register
                </button>
              </p>
            </form>

            {/* Sign Up Form */}
            <form onSubmit={handleRegister} className="sign-up-form">
              <h2 className="title">Sign Up</h2>

              <div className="input-field-wrapper">
                <div className="input-field">
                  <input
                    type="text"
                    name="registerName"
                    value={formData.registerName}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('registerName')}
                    onBlur={(e) => handleBlur('registerName', e.target.value)}
                    className={errors.registerName ? 'error' : ''}
                    required
                  />
                  <label className={focusedField.registerName || formData.registerName ? 'active' : ''}>
                    Name
                  </label>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                </div>
                {errors.registerName && <span className="error-message">{errors.registerName}</span>}
              </div>

              <div className="input-field-wrapper">
                <div className="input-field">
                  <input
                    type="email"
                    name="registerEmail"
                    value={formData.registerEmail}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('registerEmail')}
                    onBlur={(e) => handleBlur('registerEmail', e.target.value)}
                    className={errors.registerEmail ? 'error' : ''}
                    required
                  />
                  <label className={focusedField.registerEmail || formData.registerEmail ? 'active' : ''}>
                    Email
                  </label>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                </div>
                {errors.registerEmail && <span className="error-message">{errors.registerEmail}</span>}
              </div>

              <div className="input-field-wrapper">
                <div className="input-field">
                  <input
                    type="password"
                    name="registerPassword"
                    value={formData.registerPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('registerPassword')}
                    onBlur={(e) => handleBlur('registerPassword', e.target.value)}
                    className={errors.registerPassword ? 'error' : ''}
                    required
                  />
                  <label className={focusedField.registerPassword || formData.registerPassword ? 'active' : ''}>
                    Password
                  </label>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                </div>
                {errors.registerPassword && <span className="error-message">{errors.registerPassword}</span>}
              </div>

              <button type="submit" className="btn solid">Sign Up</button>

              <p className="toggle-text">
                Already have an account?
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => setIsRegisterMode(false)}
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Panels Container - Contains the overlay */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>WELCOME <br />BACK!</h3>
              <p>To keep connected with us please login with your personal info</p>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>HELLO, <br />FRIEND!</h3>
              <p>Enter your personal details and start your journey with us</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
          padding: 20px;
          overflow: hidden;
        }

        @keyframes moveUp {
          0%, 100% {
            top: 25%;
          }
          50% {
            top: -35%;
          }
        }

        @keyframes moveUp2 {
          0%, 100% {
            top: 25%;
          }
          50% {
            top: -35%;
          }
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 950px;
          min-height: 600px;
          background: rgba(10, 10, 10, 0.95);
          border-radius: 20px;
          box-shadow: 
            0 0 80px rgba(32, 140, 41, 0.4),
            0 0 40px rgba(32, 140, 41, 0.3),
            0 0 20px rgba(32, 140, 41, 0.2);
          overflow: hidden;
        }

        .no-transition,
        .no-transition * {
          transition: none !important;
          animation: none !important;
        }

        .prevent-child-transitions * {
          transition: none !important;
          animation: none !important;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: left 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 5rem;
          transition: opacity 0.2s 0.7s, visibility 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
          visibility: hidden;
          transition: opacity 0s 0.7s, visibility 0s 0.7s;
        }

        form.sign-in-form {
          opacity: 1;
          z-index: 2;
        }

        .title {
          font-size: 2.5rem;
          color: #fff;
          margin-bottom: 15px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .input-field-wrapper {
          width: 100%;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          background: transparent;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 85% 15%;
          padding: 0 0.4rem;
          position: relative;
          border-bottom: 2px solid rgba(32, 140, 41, 0.4);
          transition: all 0.3s ease;
        }

        .input-field:focus-within {
          border-bottom-color: rgba(32, 140, 41, 1);
          box-shadow: 0 4px 12px rgba(32, 140, 41, 0.3);
        }

        .input-field label {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          font-weight: 400;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .input-field label.active {
          top: -8px;
          font-size: 0.75rem;
          color: rgba(32, 140, 41, 1);
          background: rgba(10, 10, 10, 0.95);
          padding: 0 8px;
        }

        .input-icon {
          text-align: center;
          line-height: 55px;
          color: rgba(32, 140, 41, 1);
          transition: 0.5s;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 1.1rem;
          color: #fff;
          padding: 0 10px;
        }

        .input-field input.error {
          color: #ff4444;
        }

        .error-message {
          color: #ff4444;
          font-size: 0.85rem;
          margin-top: 5px;
          margin-left: 0.5rem;
          display: block;
        }

        .btn {
          width: 150px;
          background: linear-gradient(135deg, rgba(32, 140, 41, 1) 0%, rgba(22, 100, 29, 1) 100%);
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 700;
          margin: 20px 0 10px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          letter-spacing: 1px;
        }

        .btn:hover {
          background: linear-gradient(135deg, rgba(22, 100, 29, 1) 0%, rgba(32, 140, 41, 1) 100%);
          box-shadow: 0 0 30px rgba(32, 140, 41, 0.6);
          transform: translateY(-2px);
        }

        .toggle-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-top: 15px;
          text-align: center;
        }

        .toggle-link {
          background: none;
          border: none;
          color: rgba(32, 140, 41, 1);
          font-weight: 600;
          cursor: pointer;
          margin-left: 5px;
          transition: all 0.2s ease;
          text-decoration: none;
          padding: 0;
        }

        .toggle-link:hover {
          color: rgba(42, 170, 51, 1);
          text-shadow: 0 0 10px rgba(32, 140, 41, 0.5);
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: none;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out, opacity 0.5s ease-in-out, visibility 0.5s;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 800;
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 20px;
          letter-spacing: 3px;
          text-shadow: 0 0 20px rgba(32, 140, 41, 0.5);
        }

        .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .right-panel .content {
          transform: translateX(800px);
          opacity: 0;
          visibility: hidden;
        }

        /* Animation */
        .auth-container.register-active .left-panel .content {
          transform: translateX(-800px);
        }

        .auth-container.register-active .signin-signup {
          left: 25%;
        }

        .auth-container.register-active form.sign-in-form {
          z-index: 1;
          opacity: 0;
          transition: opacity 0s 0.7s, visibility 0s 0.7s;
          z-index: 1;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0s 0.7s, visibility 0s 0.7s;
        }

         .auth-container.register-active form.sign-up-form {
          opacity: 1;
          z-index: 2;
          visibility: visible;
          transition: opacity 0.2s 0.7s, visibility 0s 0.7s;
        }

        .auth-container.register-active .right-panel .content {
          transform: translateX(0px);
          opacity: 1;
          visibility: visible;
        }

        .panels-container::before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(32, 140, 41, 1) 0%, rgba(22, 100, 29, 1) 50%, rgba(15, 70, 20, 1) 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
          box-shadow: 
            0 0 60px rgba(32, 140, 41, 0.6),
            0 0 100px rgba(32, 140, 41, 0.4),
            inset 0 0 80px rgba(255, 255, 255, 0.2);
        }

        .auth-container.register-active .panels-container::before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        /* Mobile Responsive */
        @media (max-width: 870px) {
          .auth-container {
            min-height: 600px;
            height: auto;
            width: 90%;
            margin: 20px 0;
          }

          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .auth-container.register-active .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1.2fr 4fr 0fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 1.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 1 / 2;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .panel .content {
            padding-right: 0;
            transition: transform 0.9s ease-in-out, opacity 0.5s ease-in-out, visibility 0.5s;
            transition-delay: 0.6s;
          }

          .panel h3 {
            font-size: 1.8rem;
          }

          .panel p {
            font-size: 0.85rem;
            padding: 0.5rem 0;
          }

          .panels-container::before {
            width: 1200px;
            height: 1200px;
            transform: translate(-50%, -100%);
            left: 50%;
            bottom: initial;
            top: 25%;
            right: initial;
            transition: 2s ease-in-out;
            animation: moveUp 1.5s ease-in-out forwards;
          }

          .auth-container.register-active .panels-container::before {
            transform: translate(-50%, -100%);
            bottom: initial;
            top: 25%;
            animation: moveUp2 1.5s ease-in-out forwards;
          }

          .auth-container.register-active .left-panel .content,
          .right-panel .content {
             transform: translateY(-50px);
             opacity: 0;
             visibility: hidden;
          }

          .auth-container.register-active .right-panel .content,
          .left-panel .content {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .auth-container.register-active .left-panel .content {
             transform: translateY(-50px);
          }

          form {
            padding: 0 1.5rem;
          }

          .title {
            font-size: 2rem;
          }
        }

        @media (max-width: 570px) {
          form {
            padding: 0 1rem;
          }

          .auth-container {
            padding: 1.5rem;
          }

          .panel .content {
            padding: 0.5rem 1rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .input-field-wrapper {
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
}