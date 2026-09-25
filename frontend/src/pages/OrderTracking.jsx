import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  XCircle, 
  MapPin, 
  Phone, 
  RefreshCw,
  Utensils,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';

export const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('id') || '';
  const [searchInput, setSearchInput] = useState(orderIdParam || 'BST-2026-901');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { success, error } = useToast();

  const fetchOrder = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getOrderById(idToSearch.trim());
      if (res.success && res.order) {
        setOrder(res.order);
        setSearchParams({ id: res.order.orderNumber || res.order._id });
      } else {
        setOrder(null);
        setErrorMsg('No order found with the provided identifier.');
      }
    } catch (err) {
      setOrder(null);
      setErrorMsg(err.message || 'Could not find order. Please verify your order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdParam) {
      fetchOrder(orderIdParam);
    } else {
      // Default fetch sample order
      fetchOrder('BST-2026-901');
    }
  }, [orderIdParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const res = await api.cancelOrder(order._id, 'Customer requested cancellation.');
      if (res.success && res.order) {
        setOrder(res.order);
        success('Order cancelled successfully.');
      }
    } catch (err) {
      error(err.message || 'Could not cancel order.');
    }
  };

  // Steps definition for visual progress stepper
  const orderSteps = [
    { key: 'placed', label: 'Order Placed', icon: <Clock size={20} /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 size={20} /> },
    { key: 'preparing', label: 'In Kitchen', icon: <ChefHat size={20} /> },
    { key: 'out_for_delivery', label: order?.orderType === 'dine_in' ? 'Table Service' : 'On Delivery', icon: <Truck size={20} /> },
    { key: 'delivered', label: 'Delivered', icon: <PackageCheck size={20} /> },
  ];

  const getStepStatus = (stepKey) => {
    if (!order) return 'upcoming';
    if (order.status === 'cancelled') return 'cancelled';

    const sequence = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = sequence.indexOf(order.status);
    const stepIndex = sequence.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="text-center" style={{ maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Live Order Tracking</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Track Your Culinary Journey</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time status updates directly from our master kitchen to your dining table or doorstep.
        </p>

        {/* Search Order Number Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '480px', margin: '1.5rem auto 0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Enter Order # (e.g. BST-2026-901)"
              style={{ paddingLeft: '38px' }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
            Track
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
          <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
          <div>Retrieving live order status...</div>
        </div>
      ) : errorMsg ? (
        <div className="glass-card text-center" style={{ padding: '3rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={36} color="#f87171" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Order Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{errorMsg}</p>
          <button onClick={() => fetchOrder('BST-2026-901')} className="btn btn-secondary btn-sm">
            View Demo Order (BST-2026-901)
          </button>
        </div>
      ) : order ? (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Main Status & Stepper Card */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Order Identifier
                </div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{order.orderNumber}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusBadge status={order.status} type="order" />
                <button
                  onClick={() => fetchOrder(order._id || order.orderNumber)}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Refresh status"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Visual Stepper */}
            <div style={{ margin: '3rem 0 2rem 0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${orderSteps.length}, 1fr)`,
                  position: 'relative',
                  gap: '8px',
                }}
              >
                {/* Connecting Track Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '22px',
                    left: '5%',
                    right: '5%',
                    height: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 1,
                  }}
                />

                {orderSteps.map((step) => {
                  const state = getStepStatus(step.key);
                  const isCompleted = state === 'completed';
                  const isCurrent = state === 'current';

                  return (
                    <div
                      key={step.key}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted
                            ? '#10b981'
                            : isCurrent
                            ? 'var(--primary)'
                            : '#1a2234',
                          color: isCompleted || isCurrent ? '#0b0f17' : 'var(--text-muted)',
                          border: isCurrent
                            ? '3px solid #fff'
                            : '2px solid rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isCurrent ? '0 0 20px rgba(229, 169, 60, 0.6)' : 'none',
                          transition: 'all 0.3s ease',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {step.icon}
                      </div>

                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? 'var(--primary)' : isCompleted ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {step.label}
                      </div>

                      {isCurrent && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#34d399',
                            fontWeight: 600,
                            marginTop: '2px',
                          }}
                        >
                          ● In Progress
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Arrival / Preparation banner */}
            {['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status) && (
              <div
                style={{
                  background: 'rgba(229, 169, 60, 0.1)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={24} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                      Estimated Preparation & Handover
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Approximately 25–35 minutes
                    </div>
                  </div>
                </div>

                {['placed', 'confirmed'].includes(order.status) && (
                  <button onClick={handleCancelOrder} className="btn btn-danger btn-sm">
                    Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status Timeline History & Order Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Timeline Notes */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>Order Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                {order.timeline?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: idx === order.timeline.length - 1 ? 'var(--primary)' : '#475569',
                        marginTop: '5px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                        {item.note || item.status}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items & Destination Summary */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>Order Information</h3>
              
              {/* Destination Details */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Destination / Dining Area</div>
                {order.orderType === 'delivery' && order.deliveryAddress ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>{order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.zipCode}</span>
                  </div>
                ) : order.orderType === 'dine_in' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                    <Utensils size={16} color="var(--primary)" />
                    <span>Table Number: <strong>{order.tableNumber || 'Assigned Table'}</strong></span>
                  </div>
                ) : (
                  <div style={{ color: '#fff' }}>Takeaway Counter Pickup</div>
                )}
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex-between" style={{ fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.quantity}x {item.name}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Tax</span>
                  <span>₹{order.tax?.toFixed(2)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryFee?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex-between" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, paddingTop: '0.5rem', marginTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
