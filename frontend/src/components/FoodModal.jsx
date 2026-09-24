import React, { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const FoodModal = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const { addToCart } = useCart();
  const { success } = useToast();

  if (!food) return null;

  const handleAdd = () => {
    addToCart(food, quantity, instructions);
    success(`Added ${quantity}x "${food.name}" to cart!`);
    onClose();
  };

  const totalPrice = (food.price * quantity).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
        }}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(20,28,44,0.9) 100%)',
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            <X size={20} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '6px' }}>
                {food.categoryName || 'Chef Recommendation'}
              </span>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', lineHeight: 1.2 }}>{food.name}</h2>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              ${food.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
              <Star size={16} fill="#fbbf24" />
              <span>{food.rating ? food.rating.toFixed(1) : '4.8'}</span>
              <span style={{ color: 'var(--text-muted)' }}>({food.reviewsCount || 15} reviews)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="var(--primary)" />
              <span>{food.prepTime || 20} mins prep</span>
            </div>
            {food.calories > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={16} color="#f43f5e" />
                <span>{food.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {food.description}
          </p>

          {/* Ingredients list */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Key Ingredients
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {food.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions Input */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Special Cooking Instructions or Dietary Preferences (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Extra sauce on side, less spicy, no onions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Quantity & Add to Cart Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Minus size={16} />
              </button>
              <span style={{ width: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Action Submit */}
            <button
              onClick={handleAdd}
              className="btn btn-primary"
              style={{ flex: 1, height: '44px' }}
            >
              <Plus size={18} />
              <span>Add to Order • ${totalPrice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
