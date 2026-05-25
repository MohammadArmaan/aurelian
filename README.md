# FurnLux Furniture E-Commerce

A premium MERN luxury furniture marketplace with classic-modern interior design inspiration.

## Features

- React + Vite frontend with Tailwind CSS and Framer Motion
- Node.js + Express backend with MongoDB and Mongoose
- JWT authentication with HTTP-only cookies
- Customer, contractor, and admin roles
- Product browsing, wishlist, cart, checkout, and booking system
- Admin analytics, product CRUD, coupon management, and review moderation
- Cloudinary-ready image upload support
- Responsive luxury UI with serif typography and warm neutral palette

## Folder Structure

- `/backend` - Express API and database models
- `/frontend` - React application and UI

## Setup

### Backend

1. Copy `.env.example` to `.env`
2. Install dependencies
    ```bash
    cd backend
    npm install
    ```
3. Start the server
    ```bash
    npm run dev
    ```
4. Seed sample data
    ```bash
    npm run seed
    ```

### Frontend

1. Install dependencies
    ```bash
    cd frontend
    npm install
    ```
2. Start the Vite app
    ```bash
    npm run dev
    ```

## Environment variables

### Backend

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend

- `VITE_API_URL`

## Notes

- Use the admin account seeded in the backend:
    - Email: `admin@furnlux.com`
    - Password: `Premium123!`

- The frontend is ready for future Stripe or Razorpay payment integration.

## Production

Set `NODE_ENV=production` and configure a production-ready MongoDB connection, secure cookie options, and Cloudinary credentials.
