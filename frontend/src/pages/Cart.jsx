import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Utensils, 
  Truck, 
  ShoppingBasket,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const [couponCode, setCouponCode] = React.useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      success(res.message);
      setCouponCode('');
    } else {
      error(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-padding container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card text-center" style={{ padding: '4rem 2rem', maxWidth: '520px', width: '100%' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Discover our haute dining selections, handcrafted pizzas, and artisanal cuts.
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            <span>Explore Menu</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/menu" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Menu
        </Link>
        <div className="flex-between">
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Shopping Cart</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Review your selected dishes before finalizing your order.</p>
          </div>
          <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: '#f87171' }}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Left Column: Items List & Dining Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Type Selector */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Select Order Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={orderType === 'delivery' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '0.9rem', padding: '0.65rem' }}
              >
                <Truck size={16} /> Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={orderType === 'dine_in' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '0.9rem', padding: '0.65rem' }}
              >
                <Utensils size={16} /> Dine-In
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={orderType === 'pickup' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '0.9rem', padding: '0.65rem' }}
              >
                <ShoppingBasket size={16} /> Takeaway
              </button>
            </div>
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div
                key={item.foodItemId}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {item.categoryName}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>{item.name}</h3>
                  <div style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700 }}>
                    ₹{item.price.toFixed(2)}
                  </div>
                  {item.instructions && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                      Note: "{item.instructions}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Quantity controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '2px',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', color: '#fff', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', color: '#fff', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ width: '80px', textAlign: 'right', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.foodItemId)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Order Summary
          </h3>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Promo code (e.g. BISTRO10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">Apply</button>
          </form>

          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
              <span>Sales Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span style={{ color: '#34d399' }}>Free (Orders &gt; ₹500)</span> : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex-between" style={{ color: '#34d399', fontWeight: 600 }}>
                <span>Promo Discount ({coupon?.code})</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div
              className="flex-between"
              style={{
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: 700,
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary"
            style={{ width: '100%', height: '50px', fontSize: '1.05rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
