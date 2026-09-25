import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Auto-seed helper
import User from './models/User.js';
import Category from './models/Category.js';
import FoodItem from './models/FoodItem.js';
import Table from './models/Table.js';
import Order from './models/Order.js';
import Reservation from './models/Reservation.js';
import { categoriesData, foodsData, tablesData } from './seed/seedData.js';

dotenv.config();

const app = express();

// Allowed origins for CORS (production deployments + local development)
const allowedOrigins = [
  'https://resturant14.vercel.app',
  'https://resturant-management-system-cy8j.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Grand Bistro Restaurant API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Auto-seed if database is empty on server startup
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding initial restaurant catalog & demo accounts...');

      const adminUser = await User.create({
        name: 'Chef Alessandro Rossi',
        email: 'admin@bistro.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
        address: {
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA',
        },
      });

      const customerUser = await User.create({
        name: 'Sophia Montgomery',
        email: 'customer@bistro.com',
        password: 'Customer@123',
        role: 'customer',
        phone: '+1 (555) 876-5432',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        address: {
          street: '450 Pine Street, Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94108',
          country: 'USA',
        },
      });

      const createdCategories = await Category.insertMany(categoriesData);
      const categoryMap = {};
      createdCategories.forEach((cat) => {
        categoryMap[cat.slug] = cat;
      });

      const formattedFoods = foodsData.map((item) => {
        const categoryDoc = categoryMap[item.categorySlug];
        return {
          name: item.name,
          description: item.description,
          price: item.price,
          category: categoryDoc._id,
          categoryName: categoryDoc.name,
          image: item.image,
          dietary: item.dietary,
          prepTime: item.prepTime,
          calories: item.calories,
          rating: item.rating,
          reviewsCount: item.reviewsCount,
          isAvailable: item.isAvailable,
          isFeatured: item.isFeatured,
          ingredients: item.ingredients,
        };
      });
      const createdFoods = await FoodItem.insertMany(formattedFoods);
      const createdTables = await Table.insertMany(tablesData);

      // Seed sample initial order & reservation for instant UI delight
      await Order.create({
        orderNumber: 'BST-2026-901',
        user: customerUser._id,
        customerInfo: {
          name: customerUser.name,
          email: customerUser.email,
          phone: customerUser.phone,
        },
        items: [
          {
            foodItem: createdFoods[0]._id,
            name: createdFoods[0].name,
            price: createdFoods[0].price,
            image: createdFoods[0].image,
            quantity: 1,
          },
          {
            foodItem: createdFoods[3]._id,
            name: createdFoods[3].name,
            price: createdFoods[3].price,
            image: createdFoods[3].image,
            quantity: 2,
          },
        ],
        subtotal: 65.50,
        tax: 5.24,
        deliveryFee: 0,
        discount: 0,
        totalAmount: 70.74,
        orderType: 'delivery',
        deliveryAddress: customerUser.address,
        status: 'preparing',
        timeline: [
          { status: 'placed', timestamp: new Date(Date.now() - 25 * 60 * 1000), note: 'Order placed by Sophia.' },
          { status: 'confirmed', timestamp: new Date(Date.now() - 20 * 60 * 1000), note: 'Kitchen confirmed order.' },
          { status: 'preparing', timestamp: new Date(Date.now() - 10 * 60 * 1000), note: 'Chef preparing items.' },
        ],
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000),
      });

      await Reservation.create({
        reservationNumber: 'RES-2026-101',
        user: customerUser._id,
        guestName: customerUser.name,
        guestEmail: customerUser.email,
        guestPhone: customerUser.phone,
        table: createdTables[7]._id,
        tableNumber: 'R-01',
        seatingArea: 'rooftop',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeSlot: '19:30',
        guestsCount: 2,
        occasion: 'anniversary',
        specialRequests: 'Candlelight romantic setup with panoramic skyline view please.',
        status: 'confirmed',
      });

      console.log('✓ Auto-seeding completed: Demo data & accounts ready!');
    }
  } catch (seedErr) {
    console.warn('Auto-seed notice:', seedErr.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🍽️  Restaurant API Server running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔐 Demo Admin: admin@bistro.com | Admin@123`);
      console.log(`👤 Demo Customer: customer@bistro.com | Customer@123`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
