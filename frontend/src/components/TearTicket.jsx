import React, { useState } from 'react';
import { CheckCircle, Scissors, Calendar, MapPin, Receipt, ArrowRight } from 'lucide-react';

export const TearTicket = ({ order, onTearComplete }) => {
  const [isTorn, setIsTorn] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  if (!order) return null;

  const orderNumber = order.orderNumber || order._id?.substring(order._id.length - 8).toUpperCase() || 'SH-2026-001';
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
  const totalAmount = order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00';

  const handleTear = () => {
    setIsTorn(true);
    if (onTearComplete) {
      setTimeout(onTearComplete, 400);
    }
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '2rem auto',
        perspective: '1000px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #1A1A1A 0%, #111111 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg), 0 0 30px rgba(212, 175, 55, 0.15)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Ticket Top Header */}
        <div
          style={{
            padding: '1.75rem 1.75rem 1rem 1.75rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(11,11,11,0.9) 100%)',
            borderBottom: '2px dashed rgba(212, 175, 55, 0.3)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              OFFICIAL RECEIPT TICKET
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
              <CheckCircle size={12} style={{ marginRight: '4px' }} /> PAYMENT VERIFIED
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', margin: 0 }}>
            The Spicey House
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
            Indian &amp; International Cuisine
          </p>
        </div>

        {/* Ticket Body Content */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Metadata Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ORDER NUMBER</span>
              <strong style={{ color: 'var(--primary-gold)', fontFamily: 'var(--font-mono)' }}>#{orderNumber}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>DATE &amp; TIME</span>
              <strong style={{ color: '#fff' }}>{orderDate}</strong>
            </div>
          </div>

          {/* Ordered Items List */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
              Purchased Items
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#fff' }}>
                  <span>
                    <strong>{item.quantity}x</strong> {item.name}
                  </span>
                  <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT PAID</span>
              <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Status: {order.status?.toUpperCase() || 'CONFIRMED'}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-gold)' }}>
              ₹{totalAmount}
            </div>
          </div>
        </div>

        {/* Perforated Rip / Tear Line */}
        <div
          style={{
            position: 'relative',
            height: '24px',
            background: 'radial-gradient(circle at 0% 50%, transparent 10px, #111 11px), radial-gradient(circle at 100% 50%, transparent 10px, #111 11px)',
            borderTop: '2px dashed rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#1A1A1A',
              padding: '2px 10px',
              borderRadius: '99px',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              fontSize: '0.7rem',
              color: 'var(--primary-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Scissors size={12} />
            <span>TEAR LINE</span>
          </div>
        </div>

        {/* Tearable Stub Footer Section */}
        <div
          onClick={handleTear}
          style={{
            padding: '1.5rem 1.75rem',
            background: '#0B0B0B',
            cursor: 'pointer',
            textAlign: 'center',
            transform: isTorn ? 'translateY(40px) rotate(4deg)' : 'none',
            opacity: isTorn ? 0.2 : 1,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            ORDER #{orderNumber}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>Tear to continue</span>
            <ArrowRight size={16} color="var(--primary-gold)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TearTicket;
