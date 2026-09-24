import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import FoodItem from '../models/FoodItem.js';
import Table from '../models/Table.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import { categoriesData, foodsData, tablesData } from './seedData.js';

const seedDatabase = async () => {
  try {
    console.log('🚀 Connecting to MongoDB for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      FoodItem.deleteMany({}),
      Table.deleteMany({}),
      Order.deleteMany({}),
      Reservation.deleteMany({}),
    ]);

    console.log('👤 Creating default Admin and Customer accounts...');
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

    console.log(`✓ Admin created: ${adminUser.email} / Admin@123`);
    console.log(`✓ Customer created: ${customerUser.email} / Customer@123`);

    console.log('🏷️ Seeding categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });

    console.log('🍲 Seeding culinary dishes...');
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
    console.log(`✓ Seeded ${createdFoods.length} gourmet dishes.`);

    console.log('🪑 Seeding dining tables...');
    const createdTables = await Table.insertMany(tablesData);
    console.log(`✓ Seeded ${createdTables.length} tables across all restaurant zones.`);

    console.log('📦 Creating initial demo orders for live dashboard visualization...');
    const sampleOrder1 = await Order.create({
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
        {
          foodItem: createdFoods[12]._id,
          name: createdFoods[12].name,
          price: createdFoods[12].price,
          image: createdFoods[12].image,
          quantity: 2,
        },
      ],
      subtotal: 92.50,
      tax: 7.40,
      deliveryFee: 0,
      discount: 0,
      totalAmount: 99.90,
      orderType: 'delivery',
      deliveryAddress: customerUser.address,
      status: 'preparing',
      timeline: [
        { status: 'placed', timestamp: new Date(Date.now() - 25 * 60 * 1000), note: 'Order placed by Sophia.' },
        { status: 'confirmed', timestamp: new Date(Date.now() - 20 * 60 * 1000), note: 'Kitchen confirmed order.' },
        { status: 'preparing', timestamp: new Date(Date.now() - 10 * 60 * 1000), note: 'Master Chef is cooking.' },
      ],
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000),
    });

    const sampleOrder2 = await Order.create({
      orderNumber: 'BST-2026-902',
      user: customerUser._id,
      customerInfo: {
        name: customerUser.name,
        email: customerUser.email,
        phone: customerUser.phone,
      },
      items: [
        {
          foodItem: createdFoods[6]._id,
          name: createdFoods[6].name,
          price: createdFoods[6].price,
          image: createdFoods[6].image,
          quantity: 2,
        },
        {
          foodItem: createdFoods[15]._id,
          name: createdFoods[15].name,
          price: createdFoods[15].price,
          image: createdFoods[15].image,
          quantity: 2,
        },
      ],
      subtotal: 107.00,
      tax: 8.56,
      deliveryFee: 0,
      discount: 0,
      totalAmount: 115.56,
      orderType: 'dine_in',
      tableNumber: 'VIP-01',
      status: 'delivered',
      timeline: [
        { status: 'placed', timestamp: new Date(Date.now() - 120 * 60 * 1000), note: 'Dine-in order placed.' },
        { status: 'confirmed', timestamp: new Date(Date.now() - 110 * 60 * 1000), note: 'Order confirmed.' },
        { status: 'preparing', timestamp: new Date(Date.now() - 95 * 60 * 1000), note: 'Dishes prepared.' },
        { status: 'delivered', timestamp: new Date(Date.now() - 60 * 60 * 1000), note: 'Served to VIP-01.' },
      ],
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
    });

    console.log('📅 Creating initial demo reservations...');
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await Reservation.create({
      reservationNumber: 'RES-2026-101',
      user: customerUser._id,
      guestName: customerUser.name,
      guestEmail: customerUser.email,
      guestPhone: customerUser.phone,
      table: createdTables[7]._id,
      tableNumber: 'R-01',
      seatingArea: 'rooftop',
      date: tomorrowStr,
      timeSlot: '19:30',
      guestsCount: 2,
      occasion: 'anniversary',
      specialRequests: 'Candlelight romantic setup with panoramic skyline view please.',
      status: 'confirmed',
    });

    await Reservation.create({
      reservationNumber: 'RES-2026-102',
      guestName: 'Marcus Vance',
      guestEmail: 'marcus.v@example.com',
      guestPhone: '+1 (555) 443-8899',
      table: createdTables[9]._id,
      tableNumber: 'VIP-01',
      seatingArea: 'vip_lounge',
      date: todayStr,
      timeSlot: '20:00',
      guestsCount: 6,
      occasion: 'business',
      specialRequests: 'Sommelier wine pairing recommendation required.',
      status: 'confirmed',
    });

    console.log('✨ Seed database completed successfully!');
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    await closeDB();
    process.exit(1);
  }
};

seedDatabase();
