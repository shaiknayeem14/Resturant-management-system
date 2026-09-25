import React, { useRef } from 'react';
import { FoodCard } from './FoodCard';

export const MagicBento = ({ foods = [], onSelectFood }) => {
  const gridRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.getElementsByClassName('magic-bento-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {foods.map((food, idx) => {
        const isWide = idx % 5 === 0;
        return (
          <div
            key={food._id}
            className="magic-bento-card"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              gridColumn: isWide ? 'span 1' : 'span 1',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Spotlight Border Glow Overlay */}
            <div
              className="magic-bento-spotlight"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                padding: '1px',
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.4), transparent 40%)',
                pointerEvents: 'none',
                zIndex: 3,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
            />

            {/* Existing Food Card preserved 100% */}
            <FoodCard
              food={food}
              variant={isWide ? 'featured' : 'standard'}
              onSelect={onSelectFood}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MagicBento;
