import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await register({ name, email, password, phone });
      success(`Welcome to L'Aura Bistro, ${newUser.name}! JWT token issued.`);
      navigate('/dashboard');
    } catch (err) {
      error(err.message || 'Registration failed. Please verify your details.');
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
      {/* Background ambient glow orbs */}
      <div
        style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '15%',
          left: '25%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          bottom: '15%',
          right: '25%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '520px', position: 'relative', zIndex: 1 }}>
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)',
          }}
        >
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
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Join our gourmet membership for fast ordering, table bookings & rewards.
            </p>

            <div style={{ marginTop: '0.85rem' }}>
              <span className="jwt-security-badge">
                <span className="jwt-security-badge-pulse" />
                <KeyRound size={13} />
                <span>JWT Secure Session Initialization</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  id="register-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Eleanor Vance"
                  style={{ paddingLeft: '42px' }}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  id="register-email"
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
              <label className="form-label">Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  id="register-phone"
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  style={{ paddingLeft: '42px' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    style={{ paddingLeft: '42px', paddingRight: '40px' }}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    style={{ paddingLeft: '42px' }}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <span>{submitting ? 'Creating Account & Issuing JWT...' : 'Register Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
