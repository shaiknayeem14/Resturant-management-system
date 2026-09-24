# 🍽️ L'Aura Bistro - Full-Stack Restaurant Management System

A modern, responsive full-stack Restaurant Management System built with **React (Vite)**, **Node.js / Express**, **MongoDB Atlas (with zero-config fallback)**, **JWT Authentication**, and modern **Vanilla CSS**.

---

## 🌟 Key Features

### 👤 Customer Features
- **Artisanal Menu Browsing**: Categorized dishes (Starters, Artisanal Pizzas, Gourmet Mains, Handcrafted Pastas, Decadent Desserts, Craft Beverages).
- **Search & Advanced Filters**: Live search keyword matching, dietary filters (*Vegan, Vegetarian, Gluten-Free, Spicy, Chef's Special*), and price/rating sorting.
- **Dish Details & Customization**: Inspect ingredients, calories, prep time, and add custom cooking notes.
- **Cart & Dynamic Pricing**: Interactive slide-over cart drawer and full cart page with real-time tax (8%), free delivery progress bar, and promo codes (`BISTRO10`, `CHEF20`).
- **Flexible Checkout**: Supports **Delivery**, **Dine-In** (table number selector), and **Takeaway** with simulated multi-payment options (Credit Card, Digital Wallet, Cash).
- **Live Order Tracking**: Multi-step visual progress stepper (*Placed → Confirmed → In Kitchen → On Delivery → Delivered*) with real-time timestamps and ETA.
- **Table Reservation System**: Pick dining date, time slot, party size, and atmosphere zone (*Indoor Grand Hall, Garden Patio, Skyline Rooftop, VIP Sommelier Lounge*) with instant confirmation reference number.
- **Customer Portal**: View past orders, live tracking shortcuts, table bookings with cancellation, and saved delivery address settings.

### 🛡️ Administrator Features
- **Analytics & Operations Overview**: Real-time KPI summary cards (*Total Revenue, Today's Revenue, Active Bookings, Orders count*), live status pipeline breakdown, and recent activity feeds.
- **Menu Catalog Manager**: Full CRUD on food items (*Add new dishes with imagery, edit prices/descriptions, toggle availability, mark Chef's picks, delete items*).
- **Order Pipeline Manager**: Filter orders by status, inspect item contents & customer details, and advance status with 1-click controls (*Confirm, Kitchen Prep, Out for Delivery, Complete*).
- **Dining Table & Seating Manager**: Configure dining tables across zones, adjust capacities, and toggle table statuses (*Available, Reserved, Occupied, Maintenance*).
- **Reservation Seating Coordinator**: Approve, seat, and manage guest bookings with table assignments.
- **User Directory**: View registered patrons and staff, toggle customer/admin roles.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) connection string (optional; an embedded in-memory database will run automatically if no Atlas URI is provided)

---

### 1. Clone & Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables (`backend/.env`)
Create a `.env` file in the `backend/` folder (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection URI (Replace with your Atlas connection string or leave local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/bistro_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=super_secret_restaurant_jwt_key_2026_modern_bistro_token
JWT_EXPIRES_IN=7d

# Frontend Origin
CLIENT_URL=http://localhost:5173
```

#### Seed Database (Optional)
The server auto-seeds initial demo dishes and accounts on first start, but you can also manually run:
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
# Server will run at http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# Web application will open at http://localhost:5173
```

---

## 🔐 Demo Credentials (1-Click Login Available)

On the login page (`/login`), you can click the **1-Click Demo Buttons** or enter:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bistro.com` | `Admin@123` | Full Admin Dashboard (`/admin`), Menu CRUD, Orders & Tables |
| **Customer** | `customer@bistro.com` | `Customer@123` | Ordering, Cart, Table Booking, Profile & Dashboard |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new customer account
- `POST /api/auth/login` - Login with email & password, returns JWT
- `GET /api/auth/me` - Get profile of authenticated user *(Protected)*
- `PUT /api/auth/profile` - Update user profile & delivery address *(Protected)*

### Food Menu (`/api/foods`)
- `GET /api/foods` - List food items with filter params: `category`, `search`, `dietary`, `sort`, `minPrice`, `maxPrice`
- `GET /api/foods/categories` - List all active food categories
- `GET /api/foods/:id` - Get single dish details
- `POST /api/foods` - Create new food item *(Admin)*
- `PUT /api/foods/:id` - Update food item *(Admin)*
- `DELETE /api/foods/:id` - Delete food item *(Admin)*

### Orders (`/api/orders`)
- `POST /api/orders` - Place new order *(Protected)*
- `GET /api/orders/my-orders` - Get current user orders *(Protected)*
- `GET /api/orders/:id` - Get order details & live tracking timeline
- `PUT /api/orders/:id/cancel` - Cancel order *(Protected)*
- `GET /api/orders` - Get all orders with status filter *(Admin)*
- `PUT /api/orders/:id/status` - Update order progression status *(Admin)*

### Dining Tables (`/api/tables`)
- `GET /api/tables` - Get tables with optional zone/capacity filters
- `GET /api/tables/:id` - Get table details
- `POST /api/tables` - Add new table configuration *(Admin)*
- `PUT /api/tables/:id` - Update table status or capacity *(Admin)*
- `DELETE /api/tables/:id` - Delete table *(Admin)*

### Reservations (`/api/reservations`)
- `POST /api/reservations` - Book a table reservation
- `GET /api/reservations/my-reservations` - Get user reservations *(Protected)*
- `PUT /api/reservations/:id/cancel` - Cancel booking *(Protected)*
- `GET /api/reservations` - Get all reservations *(Admin)*
- `PUT /api/reservations/:id/status` - Update reservation status / seat table *(Admin)*

### Admin Analytics & Users (`/api/admin`)
- `GET /api/admin/analytics` - Total revenue, daily metrics, status counts & recent feeds *(Admin)*
- `GET /api/admin/users` - Get registered users directory *(Admin)*
- `PUT /api/admin/users/:id/role` - Update user role between customer and admin *(Admin)*

---

## 🎨 Technology Stack
- **Frontend**: React 18, Vite, Vanilla CSS Design System, React Router DOM, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS, Dotenv.
- **Database**: MongoDB Atlas via Mongoose with embedded memory fallback for zero-config local testing.

---

## 📄 License
ISC License. Crafted for high performance and culinary excellence.
