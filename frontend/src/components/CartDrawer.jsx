import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Utensils, 
  ShoppingBasket,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    deliveryFee,
    discountAmount,
    total,
    orderType,
    setOrderType,
    coupon,
    applyCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      error(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  // Free delivery threshold progress (free above $50)
  const freeDeliveryThreshold = 50;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal).toFixed(2);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 8, 15, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#101626',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
          animation: 'slideLeft 0.3s ease-out',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Your Order</h3>
            <span className="badge badge-gold">{items.length} items</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Order Dining Type Toggle */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#0d121f', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '6px',
              background: 'var(--bg-input)',
              padding: '4px',
              borderRadius: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              style={{
                background: orderType === 'delivery' ? 'var(--primary)' : 'transparent',
                color: orderType === 'delivery' ? '#0b0f17' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Truck size={14} />
              <span>Delivery</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('dine_in')}
              style={{
                background: orderType === 'dine_in' ? 'var(--primary)' : 'transparent',
                color: orderType === 'dine_in' ? '#0b0f17' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Utensils size={14} />
              <span>Dine-In</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('pickup')}
              style={{
                background: orderType === 'pickup' ? 'var(--primary)' : 'transparent',
                color: orderType === 'pickup' ? '#0b0f17' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <ShoppingBasket size={14} />
              <span>Takeaway</span>
            </button>
          </div>

          {/* Delivery progress message */}
          {orderType === 'delivery' && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                {progressPercent >= 100 ? (
                  <span style={{ color: '#34d399', fontWeight: 600 }}>🎉 You qualified for Free Delivery!</span>
                ) : (
                  <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for Free Delivery</span>
                )}
                <span>₹{subtotal.toFixed(2)} / ₹500</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--gold-gradient)', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Your Cart is Empty</h4>
                <p style={{ fontSize: '0.85rem' }}>Explore our menu and select your favorite gourmet dishes.</p>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/menu');
                }}
                className="btn btn-primary btn-sm"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.foodItemId}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  backgroundColor: '#151d2f',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.2, marginBottom: '2px' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                        ₹{item.price.toFixed(2)}
                      </div>
                      {item.instructions && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                          Note: "{item.instructions}"
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.foodItemId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-end', marginTop: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity - 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity + 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0d121f',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {/* Promo code form */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Coupon code (e.g. BISTRO10)"
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.82rem', padding: '0.55rem 0.55rem 0.55rem 32px' }}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 1rem' }}>
                Apply
              </button>
            </form>

            {/* Price Calculations breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span style={{ color: '#34d399' }}>Free</span> : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                  <span>Promo ({coupon?.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  paddingTop: '0.5rem',
                  marginTop: '0.25rem',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              onClick={handleProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
