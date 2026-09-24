import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

// @desc    Book a table reservation
// @route   POST /api/reservations
// @access  Public (or Private if logged in)
export const createReservation = async (req, res, next) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      tableId,
      seatingArea = 'indoor',
      date,
      timeSlot,
      guestsCount,
      occasion = 'casual',
      specialRequests = '',
    } = req.body;

    if (!guestName || !guestEmail || !guestPhone || !date || !timeSlot || !guestsCount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, date, time slot, and guest count.',
      });
    }

    let assignedTableId = tableId;
    let assignedTableNumber = 'Auto-Assigned';

    // If a specific table was selected, verify it
    if (tableId) {
      const selectedTable = await Table.findById(tableId);
      if (selectedTable) {
        assignedTableNumber = selectedTable.tableNumber;
      }
    } else {
      // Find an available table matching capacity & seating area
      const availableTable = await Table.findOne({
        isAvailable: true,
        capacity: { $gte: Number(guestsCount) },
        location: seatingArea !== 'any' ? seatingArea : { $exists: true },
      }).sort({ capacity: 1 });

      if (availableTable) {
        assignedTableId = availableTable._id;
        assignedTableNumber = availableTable.tableNumber;
      }
    }

    const reservation = await Reservation.create({
      user: req.user ? req.user._id : undefined,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      guestPhone,
      table: assignedTableId || undefined,
      tableNumber: assignedTableNumber,
      seatingArea,
      date,
      timeSlot,
      guestsCount: Number(guestsCount),
      occasion,
      specialRequests,
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Table reserved successfully! A confirmation has been booked.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user reservations
// @route   GET /api/reservations/my-reservations
// @access  Private
export const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      $or: [{ user: req.user._id }, { guestEmail: req.user.email.toLowerCase() }],
    })
      .sort({ date: -1, timeSlot: -1 })
      .populate('table', 'tableNumber capacity location');

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
// @access  Private/Admin
export const getAllReservations = async (req, res, next) => {
  try {
    const { status, date, seatingArea, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (seatingArea && seatingArea !== 'all') {
      query.seatingArea = seatingArea;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { reservationNumber: { $regex: search.trim(), $options: 'i' } },
        { guestName: { $regex: search.trim(), $options: 'i' } },
        { guestEmail: { $regex: search.trim(), $options: 'i' } },
        { guestPhone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reservations, total] = await Promise.all([
      Reservation.find(query)
        .populate('table', 'tableNumber capacity location')
        .populate('user', 'name email')
        .sort({ date: -1, timeSlot: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Reservation.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: reservations.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation status / seating (Admin)
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status, tableId, tableNumber } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) reservation.status = status;
    if (tableId) reservation.table = tableId;
    if (tableNumber) reservation.tableNumber = tableNumber;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation updated successfully`,
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel reservation (Customer or Admin)
// @route   PUT /api/reservations/:id/cancel
// @access  Private
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Ownership or admin check
    if (
      req.user.role !== 'admin' &&
      reservation.user &&
      reservation.user.toString() !== req.user._id.toString() &&
      reservation.guestEmail !== req.user.email
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation has been cancelled',
      reservation,
    });
  } catch (error) {
    next(error);
  }
};
