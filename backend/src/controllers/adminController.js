import User from '../models/User.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import FoodItem from '../models/FoodItem.js';
import Table from '../models/Table.js';

// @desc    Get comprehensive admin analytics summary
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalOrders,
      totalDishes,
      totalTables,
      orders,
      reservations,
      activeReservationsCount,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      FoodItem.countDocuments(),
      Table.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }).select('totalAmount status createdAt items orderType'),
      Reservation.find().sort({ createdAt: -1 }).limit(10),
      Reservation.countDocuments({ status: { $in: ['confirmed', 'pending', 'seated'] } }),
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    // Calculate today's revenue & orders
    const todayOrders = orders.filter((ord) => new Date(ord.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    // Status breakdown
    const statusCounts = {
      placed: 0,
      confirmed: 0,
      preparing: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
    };

    const allOrdersIncludingCancelled = await Order.find().select('status orderType');
    allOrdersIncludingCancelled.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      analytics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        todayRevenue: Number(todayRevenue.toFixed(2)),
        totalOrders,
        todayOrdersCount: todayOrders.length,
        totalCustomers: totalUsers,
        totalDishes,
        totalTables,
        activeReservationsCount,
        statusCounts,
        recentOrders,
        recentReservations: reservations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & role filter
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
