import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Eye, 
  Filter, 
  Search,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'foods' | 'orders' | 'tables' | 'reservations' | 'users'
  const [analytics, setAnalytics] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [foodSearch, setFoodSearch] = useState('');

  // Modals State
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Food Form State
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    dietary: [],
    prepTime: 20,
    calories: 400,
    isAvailable: true,
    isFeatured: false,
    ingredients: '',
  });

  // Table Form State
  const [tableForm, setTableForm] = useState({
    tableNumber: '',
    capacity: 2,
    location: 'indoor',
    status: 'available',
    shape: 'rectangle',
    description: '',
  });

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, foodsRes, catsRes, ordersRes, tablesRes, resRes, usersRes] =
        await Promise.all([
          api.getAdminAnalytics(),
          api.getFoodItems({ limit: 100, includeUnavailable: 'true' }),
          api.getCategories(),
          api.getAllOrders({ limit: 100 }),
          api.getTables(),
          api.getAllReservations({ limit: 100 }),
          api.getAdminUsers(),
        ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (foodsRes.success) setFoods(foodsRes.foods || []);
      if (catsRes.success) setCategories(catsRes.categories || []);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (tablesRes.success) setTables(tablesRes.tables || []);
      if (resRes.success) setReservations(resRes.reservations || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Food Operations
  const handleOpenCreateFood = () => {
    setEditingFood(null);
    setFoodForm({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      dietary: [],
      prepTime: 20,
      calories: 450,
      isAvailable: true,
      isFeatured: false,
      ingredients: 'Fresh herbs, sea salt, organic garlic, extra virgin olive oil',
    });
    setFoodModalOpen(true);
  };

  const handleOpenEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category?._id || food.category,
      image: food.image,
      dietary: food.dietary || [],
      prepTime: food.prepTime || 20,
      calories: food.calories || 0,
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured,
      ingredients: (food.ingredients || []).join(', '),
    });
    setFoodModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...foodForm,
        price: Number(foodForm.price),
        prepTime: Number(foodForm.prepTime),
        calories: Number(foodForm.calories),
        ingredients: foodForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingFood) {
        const res = await api.updateFoodItem(editingFood._id, payload);
        if (res.success) {
          success(`Dish "${foodForm.name}" updated successfully!`);
        }
      } else {
        const res = await api.createFoodItem(payload);
        if (res.success) {
          success(`Dish "${foodForm.name}" created successfully!`);
        }
      }
      setFoodModalOpen(false);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to save food item');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this dish permanently?')) return;
    try {
      await api.deleteFoodItem(foodId);
      success('Dish deleted from catalog');
      loadData();
    } catch (err) {
      error(err.message || 'Failed to delete dish');
    }
  };

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        success(`Order status updated to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      error(err.message || 'Failed to update order status');
    }
  };

  // Table Operations
  const handleSaveTable = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await api.updateTable(editingTable._id, tableForm);
        success(`Table ${tableForm.tableNumber} updated!`);
      } else {
        await api.createTable(tableForm);
        success(`Table ${tableForm.tableNumber} created!`);
      }
      setTableModalOpen(false);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to save table');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await api.deleteTable(tableId);
      success('Table removed');
      loadData();
    } catch (err) {
      error(err.message || 'Failed to delete table');
    }
  };

  // Reservation Operations
  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      await api.updateReservationStatus(resId, { status: newStatus });
      success(`Reservation marked as ${newStatus}`);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to update reservation');
    }
  };

  // User Role
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.updateUserRole(userId, newRole);
      success(`User role changed to ${newRole}`);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '85vh' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-rose">Admin Portal</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Master Control Center</span>
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Restaurant Operations Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadData} className="btn btn-secondary btn-sm">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleOpenCreateFood} className="btn btn-primary btn-sm" id="admin-add-dish-btn">
            <Plus size={16} /> Add Food Item
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          paddingBottom: '4px',
        }}
      >
        {[
          { id: 'overview', label: 'Analytics Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'foods', label: `Menu Catalog (${foods.length})`, icon: <Utensils size={18} /> },
          { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag size={18} /> },
          { id: 'tables', label: `Dining Tables (${tables.length})`, icon: <CheckCircle2 size={18} /> },
          { id: 'reservations', label: `Reservations (${reservations.length})`, icon: <Calendar size={18} /> },
          { id: 'users', label: `Users (${users.length})`, icon: <Users size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
              background: activeTab === tab.id ? 'rgba(229,169,60,0.1)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: ANALYTICS OVERVIEW ================= */}
      {activeTab === 'overview' && analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span>Total Revenue</span>
                <DollarSign size={20} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                ${analytics.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px' }}>
                Today's: ${analytics.todayRevenue?.toFixed(2)}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span>Total Orders</span>
                <ShoppingBag size={20} color="#60a5fa" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-serif)' }}>
                {analytics.totalOrders}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {analytics.todayOrdersCount} orders placed today
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span>Active Bookings</span>
                <Calendar size={20} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-serif)' }}>
                {analytics.activeReservationsCount}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Across {analytics.totalTables} dining tables
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span>Catalog Dishes</span>
                <Utensils size={20} color="#34d399" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-serif)' }}>
                {analytics.totalDishes}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {analytics.totalCustomers} registered patrons
              </div>
            </div>
          </div>

          {/* Orders Status Breakdown Bar */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>Live Order Pipeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              {Object.entries(analytics.statusCounts || {}).map(([st, count]) => (
                <div key={st} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{count}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '2px' }}>
                    {st.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders & Bookings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analytics.recentOrders?.map((ord) => (
                  <div key={ord._id} className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.88rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>#{ord.orderNumber}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.customerInfo?.name || 'Customer'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${ord.totalAmount?.toFixed(2)}</div>
                      <StatusBadge status={ord.status} type="order" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Recent Table Bookings</h3>
                <button onClick={() => setActiveTab('reservations')} className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analytics.recentReservations?.map((res) => (
                  <div key={res._id} className="flex-between" style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.88rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{res.guestName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{res.date} @ {res.timeSlot} • {res.guestsCount} Guests</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Table: {res.tableNumber}</div>
                      <StatusBadge status={res.status} type="reservation" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FOOD MENU MANAGEMENT ================= */}
      {activeTab === 'foods' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search menu items..."
                className="form-control"
                style={{ paddingLeft: '36px' }}
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
              />
            </div>
            <button onClick={handleOpenCreateFood} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Dish
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Dish</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Prep Time</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods
                  .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                  .map((food) => (
                    <tr key={food._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={food.image} alt={food.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{food.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{food.calories} kcal • ⭐ {food.rating}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{food.categoryName || food.category?.name}</td>
                      <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 700 }}>${food.price.toFixed(2)}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{food.prepTime} mins</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${food.isAvailable ? 'badge-emerald' : 'badge-rose'}`}>
                          {food.isAvailable ? 'Available' : 'Sold Out'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEditFood(food)}
                            className="btn btn-secondary btn-sm btn-icon"
                            title="Edit dish"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food._id)}
                            className="btn btn-danger btn-sm btn-icon"
                            title="Delete dish"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDER MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div>
          {/* Order Status Filters */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '4px' }}>
            {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  border: orderStatusFilter === st ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: orderStatusFilter === st ? 'var(--primary)' : 'var(--bg-input)',
                  color: orderStatusFilter === st ? '#0b0f17' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders
              .filter((o) => orderStatusFilter === 'all' || o.status === orderStatusFilter)
              .map((ord) => (
                <div key={ord._id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        #{ord.orderNumber}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Customer: <strong>{ord.customerInfo?.name}</strong> ({ord.customerInfo?.email} • {ord.customerInfo?.phone})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <StatusBadge status={ord.status} type="order" />
                      
                      {/* 1-Click Status Update Actions */}
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.4rem 1.8rem 0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirm Order</option>
                        <option value="preparing">Send to Kitchen</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Type & Address Details */}
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Type: <strong style={{ color: '#fff' }}>{ord.orderType?.toUpperCase()}</strong>
                    {ord.orderType === 'delivery' && ord.deliveryAddress && (
                      <span> • Destination: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}</span>
                    )}
                    {ord.orderType === 'dine_in' && ord.tableNumber && (
                      <span> • Table: <strong style={{ color: 'var(--primary)' }}>{ord.tableNumber}</strong></span>
                    )}
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                    {ord.items?.map((it, idx) => (
                      <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', color: '#fff' }}>
                        {it.quantity}x {it.name} (${(it.price * it.quantity).toFixed(2)})
                      </span>
                    ))}
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Payment: {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Total: ${ord.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: TABLE MANAGEMENT ================= */}
      {activeTab === 'tables' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Restaurant Seating Plan & Zones</h3>
            <button
              onClick={() => {
                setEditingTable(null);
                setTableForm({ tableNumber: `T-0${tables.length + 1}`, capacity: 4, location: 'indoor', status: 'available', shape: 'rectangle', description: '' });
                setTableModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add Table
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {tables.map((tbl) => (
              <div
                key={tbl._id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  border: tbl.status === 'occupied' ? '1px solid #f43f5e' : tbl.status === 'reserved' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>Table {tbl.tableNumber}</div>
                  <span className={`badge ${tbl.status === 'available' ? 'badge-emerald' : tbl.status === 'reserved' ? 'badge-amber' : 'badge-rose'}`}>
                    {tbl.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Capacity: <strong>{tbl.capacity} Guests</strong></div>
                  <div>Zone: <strong>{tbl.location?.replace('_', ' ').toUpperCase()}</strong></div>
                  <div>Shape: {tbl.shape}</div>
                </div>

                <div className="flex-between" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 1.6rem 0.3rem 0.5rem', fontSize: '0.78rem' }}
                    value={tbl.status}
                    onChange={async (e) => {
                      await api.updateTable(tbl._id, { status: e.target.value });
                      success(`Table status updated to ${e.target.value}`);
                      loadData();
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>

                  <button
                    onClick={() => handleDeleteTable(tbl._id)}
                    className="btn btn-danger btn-sm btn-icon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: RESERVATION MANAGEMENT ================= */}
      {activeTab === 'reservations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservations.map((res) => (
            <div key={res._id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                    #{res.reservationNumber} • {res.guestName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {res.date} at {res.timeSlot} • {res.guestsCount} Guests • {res.guestEmail} • {res.guestPhone}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={res.status} type="reservation" />
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.4rem 1.8rem 0.4rem 0.6rem', fontSize: '0.85rem' }}
                    value={res.status}
                    onChange={(e) => handleUpdateReservationStatus(res._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Zone: <strong style={{ color: '#fff' }}>{res.seatingArea?.toUpperCase()}</strong> • Assigned Table: <strong style={{ color: 'var(--primary)' }}>{res.tableNumber}</strong> • Occasion: {res.occasion}
                {res.specialRequests && <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>Note: "{res.specialRequests}"</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 6: USER DIRECTORY ================= */}
      {activeTab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>{u.name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-gold'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleUserRole(u._id, u.role)}
                      className="btn btn-secondary btn-sm"
                    >
                      Toggle {u.role === 'admin' ? 'Customer' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= FOOD CREATE/EDIT MODAL ================= */}
      {foodModalOpen && (
        <div className="modal-overlay" onClick={() => setFoodModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>{editingFood ? 'Edit Dish' : 'Add New Culinary Dish'}</h2>
              <button onClick={() => setFoodModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Dish Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className="form-control"
                  required
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  required
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ingredients (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Prep Time (mins)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={foodForm.prepTime}
                    onChange={(e) => setFoodForm({ ...foodForm, prepTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={foodForm.calories}
                    onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={foodForm.isAvailable}
                    onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                  />
                  <span>Available for Order</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={foodForm.isFeatured}
                    onChange={(e) => setFoodForm({ ...foodForm, isFeatured: e.target.checked })}
                  />
                  <span>Chef's Featured Dish</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {editingFood ? 'Save Changes' : 'Create Dish'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TABLE CREATE MODAL ================= */}
      {tableModalOpen && (
        <div className="modal-overlay" onClick={() => setTableModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Add Table Configuration</h2>
              <button onClick={() => setTableModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTable} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Table Number (e.g. T-10, P-05) *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Guest Capacity *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="20"
                    required
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dining Zone *</label>
                  <select
                    className="form-select"
                    value={tableForm.location}
                    onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  >
                    <option value="indoor">Indoor Hall</option>
                    <option value="outdoor_patio">Garden Patio</option>
                    <option value="rooftop">Skyline Rooftop</option>
                    <option value="vip_lounge">VIP Lounge</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Save Table
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
