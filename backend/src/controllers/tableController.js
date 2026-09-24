import Table from '../models/Table.js';

// @desc    Get all tables with optional filter
// @route   GET /api/tables
// @access  Public
export const getTables = async (req, res, next) => {
  try {
    const { location, status, minCapacity } = req.query;
    const query = {};

    if (location && location !== 'all') {
      query.location = location;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (minCapacity) {
      query.capacity = { $gte: Number(minCapacity) };
    }

    const tables = await Table.find(query).sort({ tableNumber: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single table details
// @route   GET /api/tables/:id
// @access  Public
export const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, table });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new table (Admin)
// @route   POST /api/tables
// @access  Private/Admin
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location, status, shape, description } = req.body;

    const existingTable = await Table.findOne({ tableNumber: tableNumber.trim() });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: `Table number "${tableNumber}" already exists`,
      });
    }

    const table = await Table.create({
      tableNumber: tableNumber.trim(),
      capacity: Number(capacity),
      location: location || 'indoor',
      status: status || 'available',
      shape: shape || 'rectangle',
      description: description || '',
      isAvailable: status !== 'maintenance',
    });

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update table (Admin)
// @route   PUT /api/tables/:id
// @access  Private/Admin
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Table updated successfully',
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete table (Admin)
// @route   DELETE /api/tables/:id
// @access  Private/Admin
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Table deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
