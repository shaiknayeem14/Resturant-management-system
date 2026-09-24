import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  EyeOff,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      success(`Welcome back, ${loggedInUser.name}! JWT token generated.`);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      error(err.message || 'Invalid email or password credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    try {
      const loggedInUser = await login(demoEmail, demoPass);
      success(`JWT Authenticated as ${loggedInUser.name} (${loggedInUser.role})!`);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      error(err.message || 'Failed demo login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="section-padding"
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Background glow orbs for rich glassmorphism */}
      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          top: '20%',
          left: '30%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          bottom: '20%',
          right: '30%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.12)',
          }}
        >
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '18px',
                background: 'var(--gold-gradient)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070a12',
                marginBottom: '1rem',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
              }}
            >
              <UtensilsCrossed size={28} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Sign in to manage orders, table reservations & your dining portal.
            </p>

            {/* JWT Security Pill */}
            <div style={{ marginTop: '0.85rem' }}>
              <span className="jwt-security-badge">
                <span className="jwt-security-badge-pulse" />
                <KeyRound size={13} />
                <span>Secured with JWT Bearer Auth</span>
              </span>
            </div>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div
            style={{
              marginBottom: '1.75rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              borderRadius: '14px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-gold)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <Sparkles size={13} />
              <span>1-Click Demo Access</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                id="demo-admin-login-btn"
                type="button"
                onClick={() => handleDemoLogin('admin@bistro.com', 'Admin@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.82rem', padding: '0.55rem 0.6rem' }}
              >
                <ShieldCheck size={15} color="#f43f5e" />
                <span>Demo Admin</span>
              </button>
              <button
                id="demo-customer-login-btn"
                type="button"
                onClick={() => handleDemoLogin('customer@bistro.com', 'Customer@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.82rem', padding: '0.55rem 0.6rem' }}
              >
                <UserCheck size={15} color="#34d399" />
                <span>Demo Customer</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  style={{ paddingLeft: '42px' }}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <span>{submitting ? 'Authenticating with JWT...' : 'Sign In with JWT'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center" style={{ marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
