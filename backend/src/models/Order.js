import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  instructions: {
    type: String,
    default: '',
  },
});

const statusTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      enum: ['delivery', 'dine_in', 'pickup'],
      default: 'delivery',
    },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      landmark: { type: String, default: '' },
    },
    tableNumber: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    timeline: [statusTimelineSchema],
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash_on_delivery', 'upi_wallet', 'online'],
      default: 'credit_card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    specialNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate human-readable order number if missing
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `BST-${Date.now().toString().slice(-6)}${randomSuffix}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
