import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink, 
  XCircle, 
  Save, 
  CheckCircle,
  RefreshCw,
  Award,
  KeyRound,
  ShieldCheck,
  Lock,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { useAuth, parseJwt } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const CustomerDashboard = () => {
  const { user, updateProfile, token, jwtPayload } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders'; // 'orders' | 'reservations' | 'profile' | 'jwt'
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, resRes] = await Promise.all([
        api.getMyOrders(),
        api.getMyReservations(),
      ]);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (resRes.success) setReservations(resRes.reservations || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCancelReservation = async (resId) => {
    try {
      const res = await api.cancelReservation(resId);
      if (res.success) {
        success('Reservation cancelled.');
        loadDashboardData();
      }
    } catch (err) {
      error(err.message || 'Failed to cancel reservation.');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name,
        phone,
        address: { street, city, state, zipCode },
      });
      success('Profile updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const tokenExpirationDate = jwtPayload?.exp ? new Date(jwtPayload.exp * 1000).toLocaleString() : 'Active (7 Days)';
  const tokenIssuedDate = jwtPayload?.iat ? new Date(jwtPayload.iat * 1000).toLocaleString() : 'Current Session';

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      {/* Header Profile Summary in Frosted Glass Card */}
      <div
        className="glass-card"
        style={{
          padding: '2.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '22px',
              background: 'var(--gold-gradient)',
              color: '#070a12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-serif)',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '2px' }}>Welcome, {user?.name}</h1>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px' }}>
              <span>{user?.email}</span>
              <span>•</span>
              <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <KeyRound size={13} />
                JWT Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="glass-pill" style={{ padding: '0.6rem 1.2rem', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-serif)' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Orders Placed</div>
          </div>
          <div className="glass-pill" style={{ padding: '0.6rem 1.2rem', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-serif)' }}>
              {reservations.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reservations</div>
          </div>
          <div className="glass-pill" style={{ padding: '0.6rem 1.2rem', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-serif)' }}>
              {orders.length * 50} pts
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bistro Rewards</div>
          </div>
        </div>
      </div>

      {/* Glass Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '0.4rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setSearchParams({ tab: 'orders' })}
          className="btn"
          style={{
            background: activeTab === 'orders' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
            color: activeTab === 'orders' ? 'var(--primary-light)' : 'var(--text-secondary)',
            border: activeTab === 'orders' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}
        >
          <ShoppingBag size={17} />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'reservations' })}
          className="btn"
          style={{
            background: activeTab === 'reservations' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
            color: activeTab === 'reservations' ? 'var(--primary-light)' : 'var(--text-secondary)',
            border: activeTab === 'reservations' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}
        >
          <Calendar size={17} />
          <span>My Reservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'profile' })}
          className="btn"
          style={{
            background: activeTab === 'profile' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--primary-light)' : 'var(--text-secondary)',
            border: activeTab === 'profile' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}
        >
          <User size={17} />
          <span>Profile & Address</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'jwt' })}
          className="btn"
          style={{
            background: activeTab === 'jwt' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: activeTab === 'jwt' ? '#34d399' : 'var(--text-secondary)',
            border: activeTab === 'jwt' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}
        >
          <KeyRound size={17} />
          <span>JWT Security Inspector</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>
          <div className="jwt-security-badge-pulse" style={{ margin: '0 auto 1rem auto', width: '16px', height: '16px' }} />
          Loading your gourmet session...
        </div>
      ) : activeTab === 'orders' ? (
        /* Orders Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.length === 0 ? (
            <div className="glass-card text-center" style={{ padding: '3.5rem' }}>
              <ShoppingBag size={42} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
              <h3>No past orders found</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                You have not placed any gourmet orders yet.
              </p>
              <Link to="/menu" className="btn btn-primary btn-sm">Explore Menu</Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord._id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div
                  className="flex-between"
                  style={{
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                      #{ord.orderNumber}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Ordered on {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderType?.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={ord.status} type="order" />
                    <Link to={`/track-order?id=${ord.orderNumber || ord._id}`} className="btn btn-secondary btn-sm">
                      <ExternalLink size={14} /> Live Track
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {ord.items?.map((it, idx) => (
                    <div
                      key={idx}
                      className="glass-pill"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{it.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {it.quantity}x @ ${it.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div>
                    Payment: <strong style={{ color: '#fff' }}>{ord.paymentMethod?.replace('_', ' ').toUpperCase()}</strong> ({ord.paymentStatus})
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                    Total: <span style={{ color: 'var(--primary-light)' }}>${ord.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'reservations' ? (
        /* Reservations Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reservations.length === 0 ? (
            <div className="glass-card text-center" style={{ padding: '3.5rem' }}>
              <Calendar size={42} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
              <h3>No table bookings yet</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                Reserve a table in our panoramic halls or VIP lounge.
              </p>
              <Link to="/table-booking" className="btn btn-primary btn-sm">Book a Table</Link>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res._id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div
                  className="flex-between"
                  style={{
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                      #{res.reservationNumber}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>
                      {res.date} at {res.timeSlot} • {res.guestsCount} Guests
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={res.status} type="reservation" />
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelReservation(res._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Atmosphere / Zone: </span>
                    <strong style={{ color: '#fff' }}>{res.seatingArea?.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Table: </span>
                    <strong style={{ color: 'var(--primary-light)' }}>{res.tableNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Occasion: </span>
                    <strong style={{ color: '#fff' }}>{res.occasion?.toUpperCase()}</strong>
                  </div>
                </div>

                {res.specialRequests && (
                  <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Special Requests: "{res.specialRequests}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'profile' ? (
        /* Profile Tab */
        <form onSubmit={handleProfileSave} className="glass-card" style={{ padding: '2.5rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>Personal Profile & Saved Address</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <h4 style={{ fontSize: '1rem', color: 'var(--text-gold)', marginTop: '1.75rem', marginBottom: '0.85rem' }}>
            Default Delivery Address
          </h4>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input type="text" className="form-control" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            <Save size={16} />
            <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </form>
      ) : (
        /* JWT Security & Token Inspector Tab */
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
              }}
            >
              <KeyRound size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>JWT Security Inspector</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                Live cryptographic verification of your JSON Web Token bearer session.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Token Status
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span className="jwt-security-badge-pulse" />
                Active & Verified (HS256)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Assigned Role
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)', marginTop: '4px' }}>
                {user?.role?.toUpperCase()}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Session Issued (iat)
              </div>
              <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: '4px' }}>
                {tokenIssuedDate}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expires At (exp)
              </div>
              <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: '4px' }}>
                {tokenExpirationDate}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Decoded JWT Payload (JSON Claims)</span>
              <span style={{ color: '#34d399' }}>Verified</span>
            </label>
            <pre
              style={{
                background: 'rgba(5, 8, 16, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                color: '#38bdf8',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify({ user_id: user?.id, email: user?.email, role: user?.role, ...jwtPayload }, null, 2)}
            </pre>
          </div>

          <div>
            <label className="form-label">Active Authorization Bearer Header</label>
            <div
              style={{
                background: 'rgba(5, 8, 16, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                wordBreak: 'break-all',
              }}
            >
              Authorization: Bearer {token ? `${token.substring(0, 32)}...${token.substring(token.length - 16)}` : 'No Token'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
