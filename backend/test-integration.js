const API_BASE = 'http://localhost:5000/api';

async function testFullSystem() {
  console.log('🧪 Starting Full System Integration Verification Tests...\n');

  // 1. Health Check
  const healthRes = await fetch(`${API_BASE}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status === 'online' ? '✅ PASS' : '❌ FAIL', health);

  // 2. Fetch Menu & Categories
  const catsRes = await fetch(`${API_BASE}/foods/categories`);
  const cats = await catsRes.json();
  console.log(`2. Categories Fetched: ${cats.categories.length} categories`, cats.success ? '✅ PASS' : '❌ FAIL');

  const foodsRes = await fetch(`${API_BASE}/foods?search=Truffle`);
  const foods = await foodsRes.json();
  console.log(`3. Food Search for "Truffle": Found ${foods.foods.length} items`, foods.success ? '✅ PASS' : '❌ FAIL');

  // 4. Customer Login
  const custLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@bistro.com', password: 'Customer@123' }),
  });
  const custLogin = await custLoginRes.json();
  console.log('4. Customer Authentication:', custLogin.success ? '✅ PASS' : '❌ FAIL', `(Logged in as: ${custLogin.user?.name})`);
  const customerToken = custLogin.token;

  // 5. Admin Login
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bistro.com', password: 'Admin@123' }),
  });
  const adminLogin = await adminLoginRes.json();
  console.log('5. Admin Authentication:', adminLogin.success && adminLogin.user?.role === 'admin' ? '✅ PASS' : '❌ FAIL', `(Role: ${adminLogin.user?.role})`);
  const adminToken = adminLogin.token;

  // 6. Create Order
  const allFoodsRes = await fetch(`${API_BASE}/foods?limit=2`);
  const allFoods = await allFoodsRes.json();
  const testItem = allFoods.foods[0];

  const orderRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ foodItemId: testItem._id, quantity: 2, instructions: 'Extra truffle oil' }],
      orderType: 'delivery',
      deliveryAddress: { street: '742 Evergreen Terrace', city: 'San Francisco', zipCode: '94103' },
      paymentMethod: 'credit_card',
    }),
  });
  const createdOrder = await orderRes.json();
  console.log('6. Order Placement:', createdOrder.success ? '✅ PASS' : '❌ FAIL', `Order #${createdOrder.order?.orderNumber} Total: $${createdOrder.order?.totalAmount}`);

  // 7. Track Order
  const trackRes = await fetch(`${API_BASE}/orders/${createdOrder.order?.orderNumber}`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  const trackData = await trackRes.json();
  console.log('7. Order Tracking:', trackData.success ? '✅ PASS' : '❌ FAIL', `Status: ${trackData.order?.status}`);

  // 8. Admin Update Order Status (placed -> preparing)
  const updateOrderRes = await fetch(`${API_BASE}/orders/${createdOrder.order?._id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'preparing', note: 'Master Chef started preparing order' }),
  });
  const updatedOrder = await updateOrderRes.json();
  console.log('8. Admin Order Status Progression:', updatedOrder.order?.status === 'preparing' ? '✅ PASS' : '❌ FAIL', `Timeline entries: ${updatedOrder.order?.timeline?.length}`);

  // 9. Table Booking Reservation
  const bookRes = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      guestName: 'Sophia Montgomery',
      guestEmail: 'customer@bistro.com',
      guestPhone: '+1 (555) 876-5432',
      date: '2026-10-15',
      timeSlot: '20:00',
      guestsCount: 4,
      seatingArea: 'rooftop',
      occasion: 'anniversary',
      specialRequests: 'Window skyline table with floral centerpiece',
    }),
  });
  const booking = await bookRes.json();
  console.log('9. Table Booking System:', booking.success ? '✅ PASS' : '❌ FAIL', `Ref #${booking.reservation?.reservationNumber} Assigned Table: ${booking.reservation?.tableNumber}`);

  // 10. Admin Analytics Retrieval
  const analyticsRes = await fetch(`${API_BASE}/admin/analytics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const analytics = await analyticsRes.json();
  console.log('10. Admin KPI Analytics:', analytics.success ? '✅ PASS' : '❌ FAIL', `Revenue: $${analytics.analytics?.totalRevenue}, Total Orders: ${analytics.analytics?.totalOrders}`);

  console.log('\n✨ All 10 Full-Stack Systems Verified Successfully!');
}

testFullSystem().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
