import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1 person'],
    },
    location: {
      type: String,
      enum: ['indoor', 'outdoor_patio', 'rooftop', 'vip_lounge', 'bar_area'],
      default: 'indoor',
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied', 'maintenance'],
      default: 'available',
    },
    shape: {
      type: String,
      enum: ['round', 'rectangle', 'square', 'booth'],
      default: 'rectangle',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Table', tableSchema);
