import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      className="section-padding container text-center"
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(229, 169, 60, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--primary)',
        }}
      >
        <UtensilsCrossed size={40} />
      </div>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.75rem 0' }}>Culinary Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: '2rem' }}>
        The dish or page you are looking for might have been moved, renamed, or is temporarily out of service.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={18} />
        <span>Return to Bistro Home</span>
      </Link>
    </div>
  );
};
