import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Truck, 
  Utensils, 
  ShoppingBasket, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const Checkout = () => {
  const {
    items,
    subtotal,
    tax,
    deliveryFee,
    discountAmount,
    total,
    orderType,
    setOrderType,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Address
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'San Francisco');
  const [state, setState] = useState(user?.address?.state || 'CA');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '94108');
  const [tableNumber, setTableNumber] = useState('T-03');
  const [specialNotes, setSpecialNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="section-padding container text-center" style={{ minHeight: '60vh' }}>
        <h2>No items to checkout</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>Please add dishes from the menu to your order first.</p>
        <Link to="/menu" className="btn btn-primary">Go to Menu</Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!customerName || !customerEmail) {
      error('Please provide your name and email address');
      return;
    }

    if (orderType === 'delivery' && (!street || !city || !zipCode)) {
      error('Please provide your complete delivery street address');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber) {
      error('Please select or specify your dining table number');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          foodItemId: i.foodItemId,
          quantity: i.quantity,
          instructions: i.instructions,
        })),
        orderType,
        deliveryAddress:
          orderType === 'delivery'
            ? { street, city, state, zipCode }
            : undefined,
        tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
        paymentMethod,
        specialNotes,
        customerInfo: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e5a93c', '#fce08b', '#34d399', '#3b82f6'],
        });

        success('Order placed successfully! Preparing your culinary experience.');
        clearCart();
        navigate(`/track-order?id=${res.order._id || res.order.orderNumber}`);
      }
    } catch (err) {
      error(err.message || 'Failed to place order. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Secure Contactless Checkout</span>
        <h1 style={{ fontSize: '2.4rem' }}>Finalize Your Dining Order</h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Column: Details & Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Dining Type Selection */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>1. Dining Preference</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={orderType === 'delivery' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                >
                  <Truck size={16} /> Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={orderType === 'dine_in' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                >
                  <Utensils size={16} /> Dine-In
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={orderType === 'pickup' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ fontSize: '0.9rem', padding: '0.75rem' }}
                >
                  <ShoppingBasket size={16} /> Takeaway
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>2. Contact Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number (for delivery/order updates)</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Delivery or Table Destination */}
            {orderType === 'delivery' && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>3. Delivery Address</h3>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 742 Montgomery St, Apt 4B"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {orderType === 'dine_in' && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>3. Table Location</h3>
                <div className="form-group">
                  <label className="form-label">Select Your Table Number *</label>
                  <select
                    className="form-select"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  >
                    <option value="T-01">T-01 (Indoor Cellar - 2 Guests)</option>
                    <option value="T-02">T-02 (Window View - 2 Guests)</option>
                    <option value="T-03">T-03 (Main Hall - 4 Guests)</option>
                    <option value="T-04">T-04 (Velvet Booth - 4 Guests)</option>
                    <option value="T-05">T-05 (Open Kitchen - 6 Guests)</option>
                    <option value="P-01">P-01 (Garden Patio - 2 Guests)</option>
                    <option value="P-02">P-02 (Garden Patio - 4 Guests)</option>
                    <option value="R-01">R-01 (Skyline Rooftop - 2 Guests)</option>
                    <option value="R-02">R-02 (Skyline Rooftop - 6 Guests)</option>
                    <option value="VIP-01">VIP-01 (Private Lounge - 8 Guests)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Special Order Notes for Head Chef & Courier</label>
                <textarea
                  className="form-textarea"
                  placeholder="Gate code, dietary alerts, allergies, or wine pairing requests..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Order Confirmation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Payment Method */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>4. Payment Method</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: paymentMethod === 'credit_card' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'credit_card' ? 'rgba(229,169,60,0.1)' : 'var(--bg-input)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                  />
                  <CreditCard size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Credit / Debit Card (Instant Test Card)</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: paymentMethod === 'upi_wallet' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'upi_wallet' ? 'rgba(229,169,60,0.1)' : 'var(--bg-input)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi_wallet"
                    checked={paymentMethod === 'upi_wallet'}
                    onChange={() => setPaymentMethod('upi_wallet')}
                  />
                  <Smartphone size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Apple Pay / Google Pay / Digital Wallet</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: paymentMethod === 'cash_on_delivery' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'cash_on_delivery' ? 'rgba(229,169,60,0.1)' : 'var(--bg-input)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                  />
                  <Banknote size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pay at Door / Pay at Table</span>
                </label>
              </div>

              {paymentMethod === 'credit_card' && (
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVC</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Preview & Totals */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Order Items ({items.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {items.map((it) => (
                  <div key={it.foodItemId} className="flex-between" style={{ fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {it.quantity}x {it.name}
                    </span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span style={{ color: '#34d399' }}>Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex-between" style={{ color: '#34d399', fontWeight: 600 }}>
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div
                  className="flex-between"
                  style={{
                    color: '#fff',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    paddingTop: '0.75rem',
                    marginTop: '0.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                {submitting ? 'Placing Order...' : `Authorize & Place Order • $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
