# GlobExpert - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Authentication & Authorization](#authentication--authorization)
8. [Features](#features)
9. [Setup & Installation](#setup--installation)
10. [Environment Configuration](#environment-configuration)
11. [Development Workflow](#development-workflow)
12. [Deployment](#deployment)

---

## Overview

**GlobExpert** is a full-stack multi-platform marketplace that connects sellers with customers for both physical products and services. The platform supports three types of users:

- **Customers (USER)**: Browse and purchase products/services
- **Sellers (SELLER)**: List and manage products/services, fulfill orders
- **Administrators (ADMIN)**: Manage users, approve sellers, oversee platform

### Key Capabilities
- Multi-role authentication and authorization
- Product and service catalog management
- Order processing and tracking
- Seller approval workflow
- Real-time analytics dashboards
- Image upload and management
- Cross-platform support (Web + Mobile)

---

## Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Flutter App   │         │   React Web     │
│   (Mobile)      │         │   (Admin)       │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │      HTTP/REST API        │
         └───────────┬───────────────┘
                     │
         ┌───────────▼───────────┐
         │   Express Backend     │
         │   (Node.js)           │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   MongoDB Database    │
         └───────────────────────┘
         
         ┌───────────────────────┐
         │   Cloudinary CDN      │
         │   (Image Storage)     │
         └───────────────────────┘
```

### Application Flow

1. **User Registration & Authentication**
   - Users register with email/password
   - JWT tokens issued for authenticated sessions
   - Role-based access control enforced

2. **Seller Onboarding**
   - Users request seller status
   - Admin reviews and approves/rejects
   - Approved sellers gain access to seller panel

3. **Catalog Management**
   - Sellers create products/services
   - Images uploaded to Cloudinary
   - Full CRUD operations with validation

4. **Order Processing**
   - Customers browse and place orders
   - Orders routed to respective sellers
   - Status tracking: CONFIRMED → PROCESSING → DELIVERED

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5.2.1
- **Database**: MongoDB 9.3.2 (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.1.1
- **Image Storage**: Cloudinary 2.8.0
- **CORS**: cors 2.8.6
- **Environment**: dotenv 17.3.1

### Mobile App (Flutter)
- **Framework**: Flutter 3.10.8
- **Language**: Dart
- **State Management**: Provider 6.0.5
- **HTTP Client**: http 1.1.0
- **Local Storage**: shared_preferences 2.5.3
- **Platforms**: iOS, Android, Web, Windows, Linux, macOS

### Web Admin (React)
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Routing**: React Router DOM 7.13.2
- **HTTP Client**: Axios 1.13.6
- **Styling**: Tailwind CSS 4.2.2
- **Icons**: React Icons 5.6.0
- **Linting**: ESLint 9.17.0

---

## Project Structure

```
Globexpert/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── config/            # Database & service configs
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, error, validation
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── validators/        # Input validation
│   ├── scripts/
│   │   ├── seed.js            # Database seeding
│   │   └── smoke-check.js     # Health checks
│   ├── uploads/               # Local file storage
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
├── user_app/                  # Flutter mobile app
│   ├── lib/
│   │   ├── core/              # Core utilities
│   │   ├── features/          # Feature modules
│   │   ├── models/            # Data models
│   │   ├── screens/           # UI screens
│   │   ├── services/          # API services
│   │   ├── widgets/           # Reusable widgets
│   │   └── main.dart          # Entry point
│   ├── android/               # Android config
│   ├── ios/                   # iOS config
│   ├── web/                   # Web config
│   ├── pubspec.yaml           # Dependencies
│   └── README.md
│
└── web_as/                    # React admin panel
    ├── src/
    │   ├── assets/            # Static assets
    │   ├── components/        # React components
    │   │   ├── layout/        # Layout components
    │   │   └── ui/            # UI components
    │   ├── context/           # React context (state)
    │   ├── pages/             # Page components
    │   ├── routes/            # Route configuration
    │   ├── services/          # API services
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── public/                # Public assets
    ├── package.json
    ├── vite.config.js         # Vite configuration
    └── README.md
```

---

## Database Schema

### Collections

#### 1. Users
```javascript
{
  _id: ObjectId,
  name: String (2-80 chars),
  email: String (unique, lowercase),
  password: String (hashed, min 6 chars),
  phone: String,
  address: String,
  role: Enum ["ADMIN", "SELLER", "USER"],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: email, role, isActive

#### 2. Sellers
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, unique),
  businessName: String (2-120 chars),
  businessDescription: String (max 1200 chars),
  status: Enum ["PENDING", "APPROVED", "REJECTED"],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: user, status

#### 3. Products
```javascript
{
  _id: ObjectId,
  seller: ObjectId (ref: User),
  title: String (2-120 chars),
  description: String (max 2000 chars),
  category: String,
  price: Number (min 0),
  stock: Number (min 0),
  imageUrl: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: seller, category, isActive, text(title, description, category)

#### 4. Services
```javascript
{
  _id: ObjectId,
  seller: ObjectId (ref: User),
  title: String (2-120 chars),
  description: String (max 2000 chars),
  category: String,
  price: Number (min 0),
  durationMinutes: Number (min 1, default 30),
  imageUrl: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: seller, category, isActive, text(title, description, category)

#### 5. Orders
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  seller: ObjectId (ref: User),
  items: [{
    itemType: Enum ["PRODUCT", "SERVICE"],
    item: ObjectId (dynamic ref),
    itemModel: Enum ["Product", "Service"],
    title: String,
    quantity: Number (min 1),
    unitPrice: Number (min 0),
    totalPrice: Number (min 0)
  }],
  subtotal: Number (min 0),
  status: Enum ["CONFIRMED", "PROCESSING", "DELIVERED"],
  deliveryAddress: String (max 200 chars),
  notes: String (max 400 chars),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: user, seller, status

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

#### POST /auth/login
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

#### GET /auth/me
Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

#### PATCH /auth/me
Update current user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": "456 New St"
}
```

---

### User Management (Admin Only)

#### POST /users
Create user by admin.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Street",
  "role": "USER",
  "isActive": true
}
```

#### GET /users
List all users with pagination and filters.

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `role` (filter by role)
- `search` (search by name/email)
- `isActive` (filter by active status)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### GET /users/:id
Get user by ID.

#### PATCH /users/:id/status
Update user active status.

**Request Body:**
```json
{
  "isActive": false
}
```

---

### Seller Management

#### POST /sellers/request
Request seller status (USER role only).

**Headers:** `Authorization: Bearer <user-token>`

**Request Body:**
```json
{
  "businessName": "My Business",
  "businessDescription": "We sell great products"
}
```

#### POST /sellers/admin-create
Create seller by admin.

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password123",
  "businessName": "Business Name",
  "businessDescription": "Description",
  "phone": "1234567890",
  "address": "123 Street"
}
```

#### GET /sellers/me
Get current seller profile.

**Headers:** `Authorization: Bearer <seller-token>`

#### GET /sellers
List all sellers (Admin only).

**Query Parameters:**
- `page`, `limit`
- `status` (PENDING, APPROVED, REJECTED)

#### PATCH /sellers/:id/status
Update seller approval status (Admin only).

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

---

### Product Management

#### GET /products
List products (public).

**Query Parameters:**
- `page`, `limit`
- `search` (text search)
- `category`
- `sellerId`
- `isActive`

#### GET /products/:id
Get product by ID (public).

#### POST /products
Create product (Seller/Admin only).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
title: "Product Name"
description: "Product description"
category: "Electronics"
price: 99.99
stock: 50
isActive: true
image: <file>
```

#### PUT /products/:id
Update product (Seller/Admin only).

#### DELETE /products/:id
Delete product (Seller/Admin only).

---

### Service Management

Same endpoints as Products, but use `/services` instead of `/products`.

**Additional Field:**
- `durationMinutes`: Number (default 30)

**No Field:**
- `stock` (not applicable to services)

---

### Order Management

#### GET /orders
List orders (filtered by role).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit`
- `status` (CONFIRMED, PROCESSING, DELIVERED)

**Behavior:**
- USER: sees their own orders
- SELLER: sees orders for their products/services
- ADMIN: sees all orders

#### GET /orders/:id
Get order by ID.

#### POST /orders
Create order (USER/ADMIN only).

**Request Body:**
```json
{
  "seller": "seller_user_id",
  "items": [
    {
      "itemType": "PRODUCT",
      "item": "product_id",
      "quantity": 2
    },
    {
      "itemType": "SERVICE",
      "item": "service_id",
      "quantity": 1
    }
  ],
  "deliveryAddress": "123 Delivery St",
  "notes": "Please deliver after 5pm"
}
```

#### PATCH /orders/:id/status
Update order status (Seller/Admin only).

**Request Body:**
```json
{
  "status": "PROCESSING"
}
```

---

## Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: "user_id",
  role: "USER|SELLER|ADMIN",
  iat: timestamp,
  exp: timestamp
}
```

### Token Expiration
- Default: 7 days
- Configurable via `JWT_EXPIRES_IN` env variable

### Role-Based Access Control

| Endpoint | USER | SELLER | ADMIN |
|----------|------|--------|-------|
| Auth (register, login, me) | ✓ | ✓ | ✓ |
| Request seller status | ✓ | ✗ | ✗ |
| Manage own products/services | ✗ | ✓ | ✓ |
| Create orders | ✓ | ✗ | ✓ |
| Update order status | ✗ | ✓ | ✓ |
| Manage users | ✗ | ✗ | ✓ |
| Approve sellers | ✗ | ✗ | ✓ |
| View all orders | ✗ | ✗ | ✓ |

### Password Security
- Hashed using bcrypt with salt rounds: 10
- Minimum length: 6 characters
- Never returned in API responses

---

## Features

### Customer Features (Mobile App)
- Browse products and services
- Search and filter catalog
- View product/service details
- Add items to cart
- Place orders
- Track order status
- View order history
- Manage profile

### Seller Features (Web Panel)
- Dashboard with analytics
  - Total orders and revenue
  - Product/service counts
  - Order status breakdown
  - Revenue trends by day
- Manage products
  - Create, edit, delete
  - Upload images
  - Set pricing and stock
- Manage services
  - Create, edit, delete
  - Set duration and pricing
- View and manage orders
  - Update order status
  - Filter by status
- Profile management

### Admin Features (Web Panel)
- Comprehensive dashboard
  - User statistics (active/inactive)
  - Seller approval pipeline
  - Platform-wide metrics
  - Catalog capacity
- User management
  - Create users
  - Activate/deactivate accounts
  - Search and filter
- Seller management
  - Approve/reject seller requests
  - View seller profiles
  - Manage seller status
- Catalog oversight
  - View all products/services
  - Edit/delete any listing
- Order management
  - View all platform orders
  - Update order status
- Full CRUD on all resources

---

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Flutter SDK 3.10+
- Git

### Backend Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd Globexpert/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Seed database**
```bash
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Mobile App Setup

1. **Navigate to app directory**
```bash
cd Globexpert/user_app
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Run on device/emulator**
```bash
flutter run
```

Or for specific platform:
```bash
flutter run -d chrome        # Web
flutter run -d windows       # Windows
flutter run -d android       # Android
flutter run -d ios           # iOS
```

### Web Admin Setup

1. **Navigate to web directory**
```bash
cd Globexpert/web_as
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Web app runs on `http://localhost:5173`

---

## Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/globexpert

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Mobile App

Update API base URL in `lib/core/constants.dart` or equivalent:
```dart
const String API_BASE_URL = 'http://localhost:5000/api';
```

For physical devices, use your machine's IP:
```dart
const String API_BASE_URL = 'http://192.168.1.100:5000/api';
```

### Web Admin

Update API base URL in `src/services/apiClient.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## Development Workflow

### Running All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Web Admin:**
```bash
cd web_as
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd user_app
flutter run
```

### Default Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@globexpert.com | password123 |
| Seller | seller@globexpert.com | password123 |
| User | user@globexpert.com | password123 |

### Development Scripts

**Backend:**
- `npm start` - Production mode
- `npm run dev` - Development with nodemon
- `npm run seed` - Seed database
- `npm run smoke` - Health check

**Web Admin:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Mobile App:**
- `flutter run` - Run app
- `flutter build apk` - Build Android APK
- `flutter build ios` - Build iOS app
- `flutter test` - Run tests
- `flutter pub outdated` - Check outdated packages

---

## Deployment

### Backend Deployment

1. **Set production environment variables**
2. **Build and deploy to hosting service** (Heroku, AWS, DigitalOcean, etc.)
3. **Ensure MongoDB is accessible**
4. **Configure Cloudinary for production**

**Example (Heroku):**
```bash
heroku create globexpert-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<production-mongodb-uri>
heroku config:set JWT_SECRET=<strong-secret>
git push heroku main
```

### Web Admin Deployment

1. **Update API base URL for production**
2. **Build production bundle**
```bash
npm run build
```
3. **Deploy `dist/` folder to hosting** (Vercel, Netlify, AWS S3, etc.)

**Example (Vercel):**
```bash
vercel --prod
```

### Mobile App Deployment

**Android:**
```bash
flutter build apk --release
# APK located at: build/app/outputs/flutter-apk/app-release.apk
```

Upload to Google Play Console.

**iOS:**
```bash
flutter build ios --release
```

Open in Xcode and submit to App Store.

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Pagination Meta
```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Security Considerations

1. **Password Storage**: Bcrypt hashing with salt
2. **JWT Tokens**: Secure secret, reasonable expiration
3. **Input Validation**: All inputs validated and sanitized
4. **File Upload**: Size limits, type validation
5. **CORS**: Configured for specific origins in production
6. **Rate Limiting**: Implement in production
7. **HTTPS**: Required in production
8. **Environment Variables**: Never commit secrets

---

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env configuration
- Check port 5000 is available

### Mobile app can't connect to API
- Use machine IP instead of localhost
- Check firewall settings
- Verify API is running

### Image upload fails
- Check Cloudinary credentials
- Verify file size < 5MB
- Ensure file is valid image format

### Authentication errors
- Check JWT_SECRET is set
- Verify token hasn't expired
- Ensure Authorization header is correct

---

## Support & Contribution

For issues, feature requests, or contributions, please contact the development team or create an issue in the repository.

---

**Last Updated**: May 2026
**Version**: 1.0.0
