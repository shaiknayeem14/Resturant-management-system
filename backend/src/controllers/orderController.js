import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      orderType = 'delivery',
      deliveryAddress,
      tableNumber,
      paymentMethod = 'credit_card',
      specialNotes = '',
      customerInfo,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to place an order.',
      });
    }

    // Fetch and verify all food items
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId || item.foodItem || item._id);
      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Item not found: ${item.name || 'Unknown Item'}`,
        });
      }
      if (!food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${food.name}" is currently sold out.`,
        });
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const itemTotal = food.price * quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        foodItem: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
        instructions: item.instructions || '',
      });
    }

    // Calculations: Tax (8%), Delivery Fee ($5 for delivery if subtotal < 50, otherwise free)
    const tax = Number((subtotal * 0.08).toFixed(2));
    const deliveryFee = orderType === 'delivery' ? (subtotal >= 50 ? 0 : 4.99) : 0;
    const discount = 0; // Coupon discounts can be applied here
    const totalAmount = Number((subtotal + tax + deliveryFee - discount).toFixed(2));

    // Estimated delivery / preparation time (approx 35-45 mins from now)
    const estimatedTime = new Date(Date.now() + 40 * 60 * 1000);

    const initialTimeline = [
      {
        status: 'placed',
        timestamp: new Date(),
        note: 'Order placed by customer and sent to restaurant.',
      },
    ];

    const order = await Order.create({
      user: req.user._id,
      customerInfo: {
        name: customerInfo?.name || req.user.name,
        email: customerInfo?.email || req.user.email,
        phone: customerInfo?.phone || req.user.phone || '',
      },
      items: verifiedItems,
      subtotal,
      tax,
      deliveryFee,
      discount,
      totalAmount,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress || req.user.address : undefined,
      tableNumber: orderType === 'dine_in' ? tableNumber || '' : undefined,
      status: 'placed',
      timeline: initialTimeline,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
      estimatedDeliveryTime: estimatedTime,
      specialNotes,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.foodItem', 'name image price category');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order / live tracking by ID or Order Number
// @route   GET /api/orders/:id
// @access  Private or Public with orderNumber query
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('items.foodItem', 'name image price dietary');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Access check: allow owner or admin
    if (req.user && req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, orderType, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (orderType && orderType !== 'all') {
      query.orderType = orderType;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'customerInfo.name': { $regex: search.trim(), $options: 'i' } },
        { 'customerInfo.email': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'completed';
    }

    const defaultNotes = {
      placed: 'Order placed by customer.',
      confirmed: 'Order confirmed by restaurant staff.',
      preparing: 'Head Chef is preparing your delicious meal in the kitchen.',
      out_for_delivery: 'Rider picked up your order and is on the way.',
      delivered: 'Order delivered successfully. Enjoy your meal!',
      cancelled: 'Order was cancelled.',
    };

    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || defaultNotes[status] || `Status updated to ${status}`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['preparing', 'out_for_delivery', 'delivered'].includes(order.status) && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled once preparation or delivery has begun. Please call the restaurant.',
      });
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: req.body.reason || `Order cancelled by ${req.user.role === 'admin' ? 'Restaurant Admin' : 'Customer'}.`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};
