# GlobExpert

Multi-platform marketplace connecting sellers with customers for products and services.

## Structure

- **backend/** - Node.js/Express API + MongoDB
- **user_app/** - Flutter mobile app (iOS/Android)
- **web_as/** - React admin web app

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
