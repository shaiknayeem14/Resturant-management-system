import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Wine, 
  Compass, 
  Info,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TableBooking = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('19:30');
  const [guestsCount, setGuestsCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState('indoor');
  const [selectedTableId, setSelectedTableId] = useState('');
  const [occasion, setOccasion] = useState('casual');
  const [specialRequests, setSpecialRequests] = useState('');

  // Guest Details
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');

  // Tables from API
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const zones = [
    {
      id: 'indoor',
      name: 'Indoor Grand Hall',
      desc: 'Ambient chandeliers, oak timbers & wine cellar view.',
      icon: <Wine size={20} color="var(--primary)" />,
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'outdoor_patio',
      name: 'Garden Patio',
      desc: 'Al fresco dining surrounded by lush olive trees & pergola lanterns.',
      icon: <Compass size={20} color="#34d399" />,
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'rooftop',
      name: 'Skyline Rooftop',
      desc: 'Panoramic skyline view with firepits and sunset cocktail seating.',
      icon: <Sparkles size={20} color="#f59e0b" />,
      img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vip_lounge',
      name: 'VIP Sommelier Room',
      desc: 'Private tasting salon with dedicated maître d’ and wine pairings.',
      icon: <Heart size={20} color="#f43f5e" />,
      img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Fetch available tables
  useEffect(() => {
    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const res = await api.getTables({
          location: seatingArea !== 'any' ? seatingArea : undefined,
          minCapacity: guestsCount,
        });
        if (res.success) {
          setTables(res.tables || []);
          if (res.tables && res.tables.length > 0) {
            setSelectedTableId(res.tables[0]._id);
          } else {
            setSelectedTableId('');
          }
        }
      } catch (err) {
        console.error('Failed to load tables', err);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, [seatingArea, guestsCount]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!guestName || !guestEmail || !guestPhone) {
      error('Please provide your name, email, and phone number');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        guestName,
        guestEmail,
        guestPhone,
        date,
        timeSlot,
        guestsCount: Number(guestsCount),
        seatingArea,
        tableId: selectedTableId || undefined,
        occasion,
        specialRequests,
      };

      const res = await api.createReservation(payload);
      if (res.success && res.reservation) {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e5a93c', '#fce08b', '#34d399'],
        });
        setConfirmedBooking(res.reservation);
        success('Table reserved successfully!');
      }
    } catch (err) {
      error(err.message || 'Failed to book reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="text-center" style={{ maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Gastronomy Reservations</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>Reserve Your Table</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Join us for an extraordinary evening of fine dining. Instant confirmation with bespoke seating options.
        </p>
      </div>

      {confirmedBooking ? (
        /* Confirmation Card */
        <div
          className="glass-card text-center"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '3rem 2rem',
            border: '1px solid var(--border-gold)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#0b0f17',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <Check size={36} strokeWidth={3} />
          </div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Reservation Confirmed</span>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>We Look Forward to Welcoming You</h2>
          <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>
            Reference #{confirmedBooking.reservationNumber}
          </div>

          <div
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.92rem',
              marginBottom: '2rem',
            }}
          >
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Guest Name</span>
              <strong style={{ color: '#fff' }}>{confirmedBooking.guestName}</strong>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Date & Time</span>
              <strong style={{ color: '#fff' }}>{confirmedBooking.date} at {confirmedBooking.timeSlot}</strong>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Party Size</span>
              <strong style={{ color: '#fff' }}>{confirmedBooking.guestsCount} Guests</strong>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-secondary)' }}>Assigned Table / Zone</span>
              <strong style={{ color: 'var(--primary)' }}>{confirmedBooking.tableNumber} ({confirmedBooking.seatingArea})</strong>
            </div>
            {confirmedBooking.specialRequests && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Special Requests: </span>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{confirmedBooking.specialRequests}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setConfirmedBooking(null);
              }}
              className="btn btn-secondary"
            >
              Book Another Table
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard?tab=reservations' : '/')}
              className="btn btn-primary"
            >
              {isAuthenticated ? 'View My Bookings' : 'Return Home'}
            </button>
          </div>
        </div>
      ) : (
        /* Table Booking Form */
        <form onSubmit={handleSubmitBooking}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Date, Time & Zone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Party Size & Date */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>1. Date & Party Size</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Reservation Date *</label>
                    <input
                      id="reservation-date-input"
                      type="date"
                      min={todayStr}
                      className="form-control"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Number of Guests *</label>
                    <select
                      id="reservation-guests-select"
                      className="form-select"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slot Chips */}
                <div>
                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                    Select Preferred Time Slot *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          border: timeSlot === slot ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          background: timeSlot === slot ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                          color: timeSlot === slot ? '#0b0f17' : 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seating Zone Selection */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>2. Seating Atmosphere</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => setSeatingArea(zone.id)}
                      style={{
                        border: seatingArea === zone.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: seatingArea === zone.id ? 'rgba(229,169,60,0.1)' : 'var(--bg-input)',
                        borderRadius: '12px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {zone.icon}
                        <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{zone.name}</h4>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {zone.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specific Table Selector */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>3. Table Preference</h3>
                {loadingTables ? (
                  <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Loading tables for {seatingArea}...</div>
                ) : tables.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Auto-allocation will assign the best matching table in this zone.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tables.map((tbl) => (
                      <button
                        key={tbl._id}
                        type="button"
                        onClick={() => setSelectedTableId(tbl._id)}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '10px',
                          border: selectedTableId === tbl._id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          background: selectedTableId === tbl._id ? 'rgba(229,169,60,0.2)' : 'var(--bg-input)',
                          color: selectedTableId === tbl._id ? 'var(--primary)' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        <Users size={14} />
                        <span>Table {tbl.tableNumber} (Max {tbl.capacity})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Contact & Occasion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>4. Guest Information</h3>
                
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    id="guest-name-input"
                    type="text"
                    className="form-control"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (for confirmation ticket) *</label>
                  <input
                    id="guest-email-input"
                    type="email"
                    className="form-control"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Phone Number *</label>
                  <input
                    id="guest-phone-input"
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Occasion / Celebration</label>
                  <select
                    className="form-select"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    <option value="casual">Casual Dining</option>
                    <option value="anniversary">Romantic Anniversary</option>
                    <option value="birthday">Birthday Celebration</option>
                    <option value="date_night">Date Night</option>
                    <option value="business">Business Dinner</option>
                    <option value="celebration">Special Celebration</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Special Requests / Seating Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Window seat, flower bouquet, allergies, champagne on ice upon arrival..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirmation CTA */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <Sparkles size={22} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Complimentary Sommelier Consultation</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant SMS & Email confirmation voucher issued upon booking.</div>
                  </div>
                </div>

                <button
                  id="confirm-booking-btn"
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Calendar size={20} />
                  <span>{submitting ? 'Confirming Reservation...' : 'Confirm Table Reservation'}</span>
                </button>
              </div>

            </div>
          </div>
        </form>
      )}
    </div>
  );
};
