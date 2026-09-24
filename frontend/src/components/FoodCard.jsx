import React from 'react';
import { Plus, Star, Clock, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const FoodCard = ({ food, onSelect }) => {
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!food.isAvailable) return;
    addToCart(food, 1);
    success(`Added "${food.name}" to cart!`);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(food)}
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Food Image Banner */}
      <div
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#1a2234',
        }}
      >
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(11,15,23,0.7) 100%)',
          }}
        />

        {/* Badges Top Bar */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {food.isFeatured && (
              <span className="badge badge-gold">
                <Sparkles size={12} /> Chef's Pick
              </span>
            )}
            {food.dietary?.includes('vegan') && (
              <span className="badge badge-emerald">Vegan</span>
            )}
            {food.dietary?.includes('vegetarian') && (
              <span className="badge badge-emerald">Veg</span>
            )}
            {food.dietary?.includes('spicy') && (
              <span className="badge badge-rose">
                <Flame size={12} /> Spicy
              </span>
            )}
          </div>

          <div
            style={{
              background: 'rgba(11, 15, 23, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#fbbf24',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Star size={13} fill="#fbbf24" />
            <span>{food.rating ? food.rating.toFixed(1) : '4.8'}</span>
          </div>
        </div>

        {/* Preparation Time indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#e2e8f0',
            fontSize: '0.78rem',
            background: 'rgba(0,0,0,0.6)',
            padding: '3px 8px',
            borderRadius: '6px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Clock size={12} />
          <span>{food.prepTime || 20} mins</span>
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>
            {food.categoryName || food.category?.name || 'Gourmet Dish'}
          </div>
          <h3
            style={{
              fontSize: '1.15rem',
              marginBottom: '0.5rem',
              color: '#fff',
              lineHeight: 1.3,
            }}
          >
            {food.name}
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}
          >
            {food.description}
          </p>
        </div>

        {/* Bottom Price & Add Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price</span>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              ${food.price.toFixed(2)}
            </div>
          </div>

          <button
            id={`add-to-cart-${food._id}`}
            onClick={handleAddToCart}
            disabled={!food.isAvailable}
            className={food.isAvailable ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              borderRadius: '10px',
              padding: '0.55rem 0.9rem',
              opacity: food.isAvailable ? 1 : 0.6,
            }}
          >
            <Plus size={16} />
            <span>{food.isAvailable ? 'Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
