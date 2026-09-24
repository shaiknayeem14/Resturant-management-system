import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    reservationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allow guest bookings or registered user
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: false,
    },
    tableNumber: {
      type: String,
      default: 'Auto Assigned',
    },
    seatingArea: {
      type: String,
      enum: ['indoor', 'outdoor_patio', 'rooftop', 'vip_lounge', 'any'],
      default: 'indoor',
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: [true, 'Reservation date is required'],
    },
    timeSlot: {
      type: String, // e.g., '19:00'
      required: [true, 'Reservation time slot is required'],
    },
    guestsCount: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Must be at least 1 guest'],
      max: [20, 'For groups larger than 20, please contact management directly'],
    },
    occasion: {
      type: String,
      enum: ['casual', 'birthday', 'anniversary', 'business', 'date_night', 'celebration'],
      default: 'casual',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate reservation reference number
reservationSchema.pre('validate', function (next) {
  if (!this.reservationNumber) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    this.reservationNumber = `RES-${Date.now().toString().slice(-6)}${randomSuffix}`;
  }
  next();
});

export default mongoose.model('Reservation', reservationSchema);
