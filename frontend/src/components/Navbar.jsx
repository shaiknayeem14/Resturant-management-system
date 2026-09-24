import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  LayoutDashboard,
  KeyRound,
  Compass
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, token } = useAuth();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header
      className="glass-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        zIndex: 900,
        backgroundColor: isScrolled ? 'rgba(8, 12, 22, 0.85)' : 'rgba(8, 12, 22, 0.6)',
        backdropFilter: 'blur(24px) saturate(190%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
        transition: 'all 0.35s ease',
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070a12',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <UtensilsCrossed size={24} strokeWidth={2.5} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              L'AURA
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.28em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Haute Bistro
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links in Frosted Glass Pill */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
              border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
              border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
            })}
          >
            Menu & Dining
          </NavLink>
          <NavLink
            to="/table-booking"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
              border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
            })}
          >
            Reserve Table
          </NavLink>
          <NavLink
            to="/track-order"
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
              border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
            })}
          >
            Track Order
          </NavLink>
        </nav>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Cart Trigger */}
          <button
            id="navbar-cart-btn"
            onClick={() => setIsDrawerOpen(true)}
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            title="View Cart"
          >
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--primary)',
                  color: '#070a12',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Auth Controls with JWT indication */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
                      : 'var(--gold-gradient)',
                    color: isAdmin ? '#fff' : '#070a12',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    boxShadow: isAdmin
                      ? '0 0 10px rgba(244, 63, 94, 0.4)'
                      : '0 0 10px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  {isAdmin ? <ShieldCheck size={16} /> : user?.name?.charAt(0) || 'U'}
                </div>
                <span
                  style={{
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                {isAdmin ? (
                  <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                    Admin
                  </span>
                ) : (
                  <span className="jwt-security-badge-pulse" title="JWT Session Active" />
                )}
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '240px',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                    zIndex: 1000,
                    animation: 'slideUp 0.2s ease-out',
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{user?.name}</div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user?.email}
                    </div>
                    <div
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.7rem',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <KeyRound size={11} />
                      <span>JWT Authenticated ({user?.role})</span>
                    </div>
                  </div>

                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.8rem',
                        color: 'var(--primary-light)',
                        textDecoration: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        transition: 'var(--transition)',
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Admin Control Panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.8rem',
                        color: '#f8fafc',
                        textDecoration: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                      }}
                    >
                      <User size={16} />
                      Customer Dashboard
                    </Link>
                  )}

                  <Link
                    to="/dashboard?tab=orders"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.8rem',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                    }}
                  >
                    <ShoppingBag size={16} />
                    My Orders
                  </Link>

                  <Link
                    to="/dashboard?tab=reservations"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.8rem',
                      color: '#f8fafc',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                    }}
                  >
                    <Calendar size={16} />
                    My Table Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.8rem',
                      color: '#fb7185',
                      background: 'rgba(244, 63, 94, 0.08)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.4rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontWeight: 600,
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out (Revoke JWT)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-btn">
                <KeyRound size={14} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '8px',
              color: 'var(--text-primary)',
              display: 'none',
              cursor: 'pointer',
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 899,
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600 }}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600 }}
          >
            Menu & Dining
          </Link>
          <Link
            to="/table-booking"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600 }}
          >
            Reserve Table
          </Link>
          <Link
            to="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600 }}
          >
            Track Order
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 700 }}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Desktop media query styling */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
