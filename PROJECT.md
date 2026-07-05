# GlobExpert

Multi-platform marketplace connecting sellers with customers for products and services.

## Structure

- **backend/** - Node.js/Express API + MongoDB
- **user_app/** - Flutter mobile app (iOS/Android)
- **web_as/** - React admin web apps

Keep the backend, mobile, and admin clients aligned with the documented API
contracts when making cross-platform changes.

## Features

- Multi-role auth (Admin/Seller/User)
- Product & service listings
- Order management
- Seller approval workflow

## Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # set MONGODB_URI and JWT_SECRET
npm run seed
npm run dev

# Mobile
cd user_app
flutter pub get
flutter run

# Web
cd web_as
npm install
npm run dev
```

## Default Credentials

- Admin: admin@globexpert.com / password123
- Seller: seller@globexpert.com / password123
- User: user@globexpert.com / password123
