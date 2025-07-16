# AquaRhône - Aquatic Activity Booking Platform

## Project Overview

AquaRhône is a full-stack web application developed as an academic project to demonstrate modern web development techniques. The application simulates a luxury aquatic activity booking platform for the Rhône River, featuring a complete booking system with user authentication, activity management, and reservation handling.

## Features

### User Functionality
- **User Authentication**: Secure registration and login system using JWT tokens
- **Activity Catalog**: Browse available aquatic activities with detailed information
- **Real-time Booking**: Select dates, time slots, and number of participants
- **Booking Management**: View, track, and cancel personal reservations
- **Responsive Design**: Optimized experience across desktop, tablet, and mobile devices

### Administrative Features
- **Admin Panel**: Dedicated interface for system administration
- **Activity Management**: Create, read, update, and delete aquatic activities
- **Booking Oversight**: Monitor all reservations and user activity
- **User Management**: Administrative control over user accounts

### Technical Features
- **Modern UI/UX**: Luxury travel agency inspired design
- **Image Integration**: Dynamic loading of activity images
- **State Management**: Reactive user interface with Vue.js 3
- **Error Handling**: Comprehensive error management and user feedback
- **Security**: Protected routes and data validation

## Technical Architecture

### Backend Structure (Node.js/Express)
```
backend/
├── app.js              # Express application configuration
├── server.js           # Server entry point
├── seed.js             # Database seeding script
├── controllers/        # Business logic controllers
│   ├── authController.js
│   ├── activityController.js   # Activity management
│   └── bookingController.js    # Booking management
├── middlewares/        # Custom middleware functions
│   ├── authMiddleware.js
│   └── validate.js
├── models/            # MongoDB data models
│   ├── User.js
│   ├── Activity.js    # Activity schema
│   └── Booking.js     # Booking schema
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── activityRoutes.js       # Activity endpoints
│   └── bookingRoutes.js        # Booking endpoints
└── tests/             # Test files
    └── auth.test.js
```

### Frontend Structure (Vue.js 3)
```
frontend/src/
├── App.vue            # Root component with global styling
├── main.js            # Vue application entry point
├── components/        # Reusable components
│   └── Navbar.vue     # Navigation header component
├── views/             # Page components
│   ├── Dashboard.vue      # Activity catalog page
│   ├── ActivityDetail.vue # Activity detail and booking page
│   ├── Login.vue         # User authentication page
│   ├── Register.vue      # User registration page
│   └── MyBookings.vue    # User booking management
├── composables/       # Reusable composition functions
│   └── auth.js        # Authentication state management
├── services/          # API service layer
│   └── api.js         # HTTP client and API calls
└── router/            # Vue Router configuration
    └── index.js
```

### Database Schema (MongoDB)
- **Users Collection**: User accounts with authentication and role management (isAdmin field)
- **Activities Collection**: Aquatic activity catalog with scheduling, pricing, and availability information
- **Bookings Collection**: Reservation records linking users to activities with date/time details

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/AeonPSR/aquarhone.git
cd aquarhone
```

### 2. Backend Configuration

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
# MongoDB Database Connection
MONGODB_URI=mongodb://localhost:27017/aquarhone-booking
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aquarhone-booking

# JWT Secret Key (generate a secure random string)
JWT_SECRET=your_secure_jwt_secret_key_here

# Server Port
PORT=5000
```

#### Database Initialization
```bash
# Optional: Seed database with sample data
node seed.js
```

#### Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```
Backend will be available at: `http://localhost:5000`

### 3. Frontend Configuration

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Development Server
```bash
# Development mode with hot-reload
npm run dev
```
Frontend will be available at: `http://localhost:5173`

### 4. Activity Images Setup

For optimal visual experience, add activity images to:
```
frontend/public/images/activities/
├── kayak.jpg
├── jet-ski.jpg
├── paddle.jpg
├── voile.jpg
├── peche.jpg
└── placeholder-activity.jpg  # Default fallback image
```

## Usage Guide

### Standard User Workflow
1. **Registration**: Create account via `/register` with modern interface
2. **Authentication**: Login via `/login` with secure credentials
3. **Browse Activities**: Explore available activities on the dashboard
4. **Make Reservations**: Select activities, dates, and time slots
5. **Manage Bookings**: View and cancel reservations via "My Bookings" page

### Administrator Workflow
1. **Admin Login**: Access with administrator account (isAdmin: true in database)
2. **Administration Panel**: Access admin features through user profile menu
3. **Activity Management**: Create, update, and delete aquatic activities
4. **Booking Monitoring**: Oversee all reservations and user activity

## Technical Implementation

### Security Features
- JWT Authentication for stateless session management
- Password hashing using bcrypt
- Route protection with authentication middleware
- CORS configuration for cross-origin request handling
- Input validation on both client and server sides

### Responsive Design
The application adapts to different screen sizes:
- Mobile (320px+): Touch-optimized interface
- Tablet (768px+): Adapted navigation and layout
- Desktop (1024px+): Full-featured experience
- Large Screens (1440px+): Extended premium design

### Technology Stack

#### Frontend Technologies
- Vue.js 3: Progressive JavaScript framework
- Vue Router: Client-side routing
- Vite: Modern build tool and development server
- CSS3: Advanced styling with animations and gradients

#### Backend Technologies
- Node.js: JavaScript runtime environment
- Express.js: Minimalist web framework
- MongoDB: NoSQL document database
- JWT: JSON Web Tokens for authentication
- bcrypt: Password hashing library

### Advanced Features
- Real-time availability management for time slots
- User statistics tracking (spending and booking history)
- Dynamic image loading with fallback handling
- Responsive design with mobile-first approach
- Modern UI animations and micro-interactions
- Glass-morphism design effects

## Development Process

This project demonstrates the complete transformation of a basic project management application into a sophisticated booking platform. The development process included:

1. **Backend Transformation**: Adapting existing models and controllers for the booking domain
2. **Database Schema Evolution**: Restructuring data models for activities and reservations
3. **Frontend Redesign**: Complete UI/UX overhaul with luxury travel agency aesthetic
4. **Feature Enhancement**: Adding real-time booking capabilities and user management
5. **Responsive Implementation**: Ensuring optimal experience across all device types

## Deployment Considerations

### Backend Deployment (Example with Heroku)
```bash
# Set environment variables
heroku config:set MONGODB_URI=your_atlas_connection_string
heroku config:set JWT_SECRET=your_secure_secret

# Deploy to Heroku
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Example with Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Project Structure Analysis

The application follows modern web development best practices:
- **Separation of Concerns**: Clear distinction between frontend and backend responsibilities
- **RESTful API Design**: Consistent API endpoints following REST conventions
- **Component Architecture**: Modular Vue.js components for reusability
- **State Management**: Centralized authentication state using Vue composables
- **Error Handling**: Comprehensive error management throughout the application