import React from 'react';

export const DriftWall = ({ foods = [], onSelectFood }) => {
  // Use existing dish items & images from props or fallback database items
  const displayItems = foods.length > 0 ? foods : [
    { _id: 'd1', name: 'Truffle Burrata', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23049?auto=format&fit=crop&w=800&q=80', categoryName: 'Starters' },
    { _id: 'd2', name: 'Artisanal Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', categoryName: 'Pizzas' },
    { _id: 'd3', name: 'Filet Mignon', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', categoryName: 'Grills' },
    { _id: 'd4', name: 'Wild Mushroom Pasta', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', categoryName: 'Pastas' },
    { _id: 'd5', name: 'Tiramisu', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80', categoryName: 'Desserts' },
    { _id: 'd6', name: 'Craft Elixir', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', categoryName: 'Beverages' },
  ];

  // Duplicate items array to form seamless infinite loop
  const seamlessList = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '1.5rem 0',
        userSelect: 'none',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        className="drift-wall-track"
        style={{
          display: 'flex',
          gap: '1.5rem',
          width: 'max-content',
          animation: 'driftWallAnimation 35s linear infinite',
        }}
      >
        {seamlessList.map((item, index) => (
          <div
            key={`${item._id}-${index}`}
            onClick={() => onSelectFood && onSelectFood(item)}
            style={{
              position: 'relative',
              width: '220px',
              height: '160px',
              borderRadius: '16px',
              overflow: 'hidden',
              flexShrink: 0,
              cursor: 'pointer',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-md)',
              background: '#171717',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
              e.currentTarget.style.borderColor = 'var(--primary-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-gold)';
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(11, 11, 11, 0.9) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                right: '12px',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--primary-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                {item.categoryName || item.category?.name || 'Gourmet'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes driftWallAnimation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .drift-wall-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default DriftWall;
