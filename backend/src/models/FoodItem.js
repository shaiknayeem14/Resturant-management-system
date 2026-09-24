import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    dietary: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'gluten-free', 'spicy', 'chef-special', 'halal', 'dairy-free'],
      default: [],
    },
    prepTime: {
      type: Number, // in minutes
      default: 20,
    },
    calories: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ingredients: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing for fast queries
foodItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('FoodItem', foodItemSchema);
