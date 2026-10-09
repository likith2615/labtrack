import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Check,
  AlertCircle,
  Cpu,
  Database,
  Terminal,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { RetroTerminalArt } from '../assets';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [errorMsg, setErrorMsg] = useState(null);
  const [timeString, setTimeString] = useState('');
  const [activeDemoRole, setActiveDemoRole] = useState(null);

  const { login, isAuthenticated, demoCredentials } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to target page
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Live Technical Terminal Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') +
        String(Math.abs(Math.floor(now.getTimezoneOffset() / 60))).padStart(2, '0')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectDemo = (roleKey) => {
    const creds = demoCredentials[roleKey];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setActiveDemoRole(roleKey);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Institutional email address and security password are required.');
      return;
    }

    setSubmitState('loading');
    try {
      const res = await login(email, password);
      setSubmitState('success');
      toast.success(`Welcome back, ${res.user.name}.`, 'Session Authenticated');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 750);
    } catch (err) {
      setSubmitState('idle');
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      toast.error(err.message || 'Authentication failed.', 'Access Denied');
    }
  };

  // Compute Role Indicator Preview based on email input
  const detectedRole = email.includes('admin')
    ? { name: 'SYSTEM ADMINISTRATOR', color: 'var(--color-accent-orange)' }
    : email.includes('student')
    ? { name: 'STUDENT RESEARCHER', color: 'var(--color-status-available)' }
    : email.includes('@')
    ? { name: 'LABORATORY STAFF', color: 'var(--color-status-maintenance)' }
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-canvas)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundImage: 'radial-gradient(circle, var(--color-border-default) 0.85px, transparent 0.85px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-panel)',
          overflow: 'hidden'
        }}
      >
        {/* =========================================================================
           LEFT PANEL: FACILITY TELEMETRY & 1-CLICK DEMO ACCESS KEYS
           ========================================================================= */}
        <div
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRight: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2rem'
          }}
        >
          <div>
            {/* Top Security Status Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid var(--color-border-default)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-accent-orange)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  LT
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1 }}>
                    LabTrack Console
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                    SECURITY GATEWAY v2.4
                  </div>
                </div>
              </div>

              <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>
                {timeString || '00:00:00'}
              </div>
            </div>

            {/* Title & Technical Copy */}
            <div
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--color-accent-orange)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Terminal size={14} />
              <span>COLLEGE LABORATORY TELEMETRY HUB</span>
            </div>

            <h1 style={{ fontSize: 'var(--text-xl)', margin: '0 0 0.65rem 0', lineHeight: 1.25 }}>
              Hardware Authorization & Allocation Station
            </h1>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Centralized identity access for campus research hardware, digital storage oscilloscopes, computing clusters, and calibration service triage.
            </p>

            {/* Illustrated Beige Retro Terminal Art with CRT scanlines & blinking cursor */}
            <div
              style={{
                marginTop: '1.25rem',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <RetroTerminalArt width="100%" height="190px" />
            </div>

            {/* 1-Click Demo Accounts Selector Deck */}
            <div style={{ marginTop: '1.5rem' }}>
              <div
                className="font-mono"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>QUICK DEMO AUTHORIZATION KEYS</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-accent-orange)' }}>1-CLICK AUTOFILL</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  {
                    key: 'admin',
                    role: 'ADMINISTRATOR',
                    name: 'Dr. Arthur Vance',
                    email: 'admin@labtrack.edu',
                    desc: 'Full console oversight, equipment registry, asset deletion & allocation desk.',
                    color: 'var(--color-accent-orange)',
                    border: 'var(--color-accent-orange-border)'
                  },
                  {
                    key: 'staff',
                    role: 'LAB INCHARGE / STAFF',
                    name: 'Elena Ramos',
                    email: 'elena.ramos@labtrack.edu',
                    desc: 'Hardware checkout/returns, calibration logs, and technician triage.',
                    color: 'var(--color-status-maintenance)',
                    border: 'var(--color-status-maintenance-border)'
                  },
                  {
                    key: 'student',
                    role: 'STUDENT RESEARCHER',
                    name: 'Liam Cooper',
                    email: 'liam.cooper@student.labtrack.edu',
                    desc: 'Hardware catalog browsing, instrument specifications & damage reports.',
                    color: 'var(--color-status-available)',
                    border: 'var(--color-status-available-border)'
                  }
                ].map((demo) => {
                  const isSelected = activeDemoRole === demo.key;

                  return (
                    <motion.button
                      key={demo.key}
                      type="button"
                      onClick={() => handleSelectDemo(demo.key)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.95rem',
                        backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-surface)',
                        border: `1px solid ${isSelected ? demo.color : 'var(--color-border-default)'}`,
                        borderLeft: `4px solid ${demo.color}`,
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: demo.color }}>
                          {demo.role}
                        </span>
                        <span className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                          {demo.email}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {demo.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                        {demo.desc}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Server Matrix */}
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <div className="font-mono">5 Labs • 45 Assets Active</div>
            <div className="font-mono">JWT RSA/HMAC-SHA256</div>
          </div>
        </div>

        {/* =========================================================================
           RIGHT PANEL: TECHNICAL AUTH TERMINAL & CREDENTIAL SUBMISSION
           ========================================================================= */}
        <div
          style={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Top orange accent strip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: 'var(--color-accent-orange)'
            }}
          />

          <div style={{ marginBottom: '1.5rem' }}>
            <div
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.35rem'
              }}
            >
              AUTHENTICATION CHECKPOINT
            </div>
            <h2 style={{ fontSize: 'var(--text-lg)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>
              Verify Operator Credentials
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Enter university credentials to initialize your role-assigned interface.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '0.75rem 0.95rem',
                  backgroundColor: 'var(--color-status-damaged-bg)',
                  border: '1px solid var(--color-status-damaged-border)',
                  borderLeft: '4px solid var(--color-status-damaged)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-status-damaged)',
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Email Address Input */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.35rem'
                }}
              >
                <span>Institutional Email Address</span>
                {detectedRole && (
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: detectedRole.color }}>
                    [{detectedRole.name}]
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="name@labtrack.edu"
                  className="form-input font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    paddingLeft: '2.2rem',
                    fontSize: 'var(--text-sm)'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.35rem'
                }}
              >
                <span>Security Access Password</span>
                <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                  DEFAULT: admin123 / staff123 / student123
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
                  size={14}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  className="form-input font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    paddingLeft: '2.2rem',
                    paddingRight: '2.2rem',
                    fontSize: 'var(--text-sm)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Action Button with 3 States */}
            <motion.button
              type="submit"
              disabled={submitState !== 'idle'}
              whileHover={submitState === 'idle' ? { y: -1 } : {}}
              whileTap={submitState === 'idle' ? { y: 1 } : {}}
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor:
                  submitState === 'success'
                    ? 'var(--color-status-available)'
                    : 'var(--color-accent-orange)',
                backgroundColor:
                  submitState === 'success'
                    ? 'var(--color-status-available)'
                    : 'var(--color-accent-orange)',
                color: '#FFFFFF',
                cursor: submitState === 'idle' ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {submitState === 'loading' && (
                <>
                  <span className="status-pulse-dot" style={{ backgroundColor: '#FFFFFF' }} />
                  <span className="font-mono" style={{ letterSpacing: '0.04em' }}>
                    VERIFYING JWT ENCRYPTION...
                  </span>
                </>
              )}
              {submitState === 'success' && (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span className="font-mono">ACCESS GRANTED • ENTERING</span>
                </>
              )}
              {submitState === 'idle' && (
                <>
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </motion.button>
          </form>

          {/* Security Assurance Notice */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <ShieldCheck size={16} color="var(--color-status-available)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
              Protected by bcrypt salted hashing and 24h JSON Web Token sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
