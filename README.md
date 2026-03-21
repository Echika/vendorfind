# 📱 VendorFind - Local Vendor Discovery Platform

![VendorFind Banner](https://via.placeholder.com/1200x300/4CAF50/ffffff?text=VendorFind+-+Discover+Local+Vendors)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-site.netlify.app)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Made with](https://img.shields.io/badge/made%20with-HTML%2FCSS%2FJS-yellow)]()

## 🌟 Overview

**VendorFind** is a web-based vendor discovery platform that connects everyday users with local vendors across all categories — food, retail, artisans, services, and more. It empowers vendors with digital visibility and gives customers a simple, reliable way to find and engage trusted local businesses.

> *"Bridging the gap between local vendors and their communities, one connection at a time."*

---

## 🎯 The Problem We Solve

### For Vendors (Like Amaka - Small Business Owner)
- 👩‍💼 **Age**: 32 | **Occupation**: Handmade crafts seller
- 😟 **Frustration**: Relies on word-of-mouth; loses sales when market is slow
- 🎯 **Goal**: Reach more customers beyond her physical market stall
- 💡 **Solution**: A free, simple platform to list her business and be found online

### For Customers (Like Chidi - Young Professional)
- 👨‍💼 **Age**: 27 | **Occupation**: Office worker
- 😟 **Frustration**: Wastes time searching without a reliable local directory
- 🎯 **Goal**: Find reliable local vendors for food, services, and goods quickly
- 💡 **Solution**: One platform to search, compare, and contact local vendors near him

---

## ✨ Key Features

### 👩‍💼 **For Vendors**
| Feature | Description |
|---------|-------------|
| **Free Registration** | Create a business profile in minutes |
| **Category Selection** | Choose from Food, Services, Retail, Artisan, or Other |
| **Location Setup** | Add your location so nearby customers can find you |
| **Photo Gallery** | Upload photos of your products or services |
| **Contact Details** | Display phone, WhatsApp, and email (clickable on mobile) |
| **Business Hours** | Set your operating hours |
| **Payment Methods** | Specify accepted payment options |
| **Dashboard** | Track profile views, ratings, and reviews |
| **Edit Profile** | Update your information anytime |

### 👨‍💼 **For Customers**
| Feature | Description |
|---------|-------------|
| **Keyword Search** | Find exactly what you need |
| **Category Filters** | Browse specific vendor types |
| **Location Filter** | Find vendors near you |
| **Vendor Cards** | Quick view of name, category, location, and rating |
| **Detailed Profiles** | Full vendor information and contact options |
| **Ratings & Reviews** | See what others are saying |
| **Review Filtering** | Sort by newest, oldest, highest, or lowest rating |
| **Share Profiles** | Share vendors via link, WhatsApp, or email |

### 👑 **For Admins**
| Feature | Description |
|---------|-------------|
| **View All Vendors** | Complete table of registered vendors |
| **Delete Listings** | Remove inappropriate or inactive vendors |
| **Export Data** | Download vendor information as JSON |

### 🌍 **SDG Impact**
| Goal | Contribution |
|------|--------------|
| **SDG 8: Decent Work & Economic Growth** | Creating income opportunities for local vendors and supporting small businesses |
| **SDG 9: Industry, Innovation & Infrastructure** | Providing digital infrastructure for local commerce and making technology accessible |

---

## 🖼️ Screenshots

| Landing Page | Search Page | Vendor Profile |
|--------------|-------------|----------------|
| ![Landing](https://via.placeholder.com/300x200/4CAF50/ffffff?text=Landing+Page) | ![Search](https://via.placeholder.com/300x200/2196F3/ffffff?text=Search+Page) | ![Profile](https://via.placeholder.com/300x200/FFC107/000000?text=Vendor+Profile) |

| Dashboard | Admin View | Mobile View |
|-----------|------------|-------------|
| ![Dashboard](https://via.placeholder.com/300x200/9C27B0/ffffff?text=Dashboard) | ![Admin](https://via.placeholder.com/300x200/F44336/ffffff?text=Admin+View) | ![Mobile](https://via.placeholder.com/300x200/607D8B/ffffff?text=Mobile+View) |

---

## 🛠️ Technology Stack
├── 🏗️ HTML5
│   ├── Semantic markup for better structure
│   ├── SEO-friendly tags
│   └── Accessibility features (ARIA labels)
│
├── 🎨 CSS3
│   ├── Flexbox & CSS Grid for responsive layouts
│   ├── CSS Variables for theme management
│   ├── Media queries for mobile responsiveness
│   ├── Animations and transitions
│   └── Custom properties for consistent design
│
└── ⚡ JavaScript (Vanilla ES6+)
    ├── No frameworks - pure JavaScript
    ├── localStorage for client-side data persistence
    ├── DOM manipulation and event handling
    ├── Asynchronous operations
    ├── Form validation
    └── Modular code structure

    /* CSS Variables for Consistent Theming */
:root {
    --primary-color: #4CAF50;
    --secondary-color: #2196F3;
    --text-color: #333;
    --light-bg: #f5f5f5;
    --shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Flexbox for Navigation */
.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* CSS Grid for Layouts */
.vendor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

/* Responsive Design with Media Queries */
@media (max-width: 768px) {
    .vendor-grid {
        grid-template-columns: 1fr;
    }
}

// ES6+ Features
const VendorFind = {
    // Arrow functions
    init: () => {
        this.initializeData();
    },
    
    // Template literals
    getStarRating: (rating) => {
        return `<span class="rating">${'★'.repeat(rating)}</span>`;
    },
    
    // LocalStorage for data persistence
    STORAGE_KEYS: {
        VENDORS: 'vendorfind_vendors',
        REVIEWS: 'vendorfind_reviews'
    },
    
    // Modern array methods
    getVendors: () => {
        return vendors.filter(v => v.category === 'Food')
                      .map(v => ({...v, displayName: v.businessName}));
    }
};

// Using Browser's localStorage as a temporary database
localStorage.setItem('vendorfind_vendors', JSON.stringify(vendors));
const vendors = JSON.parse(localStorage.getItem('vendorfind_vendors'));

// Data structure
const vendorSchema = {
    id: String,           // Unique identifier
    businessName: String, // Business name
    category: String,     // Food, Services, Retail, Artisan, Other
    location: String,     // City/Area
    rating: Number,       // Average rating (0-5)
    totalReviews: Number, // Count of reviews
    description: String,  // Business description
    contact: String,      // Phone number
    email: String,        // Email address
    photo: String         // Base64 image data
};

This project uses NO external libraries or frameworks!
Everything is built with vanilla:
├── ✅ No jQuery
├── ✅ No Bootstrap
├── ✅ No React
├── ✅ No Vue
├── ✅ No Angular
└── ✅ 100% Pure HTML, CSS, and JavaScript

Client-Side Architecture:
┌─────────────────┐
│   Browser       │
│  ┌───────────┐  │
│  │   HTML    │  │  → Structure
│  ├───────────┤  │
│  │    CSS    │  │  → Styling & Layout
│  ├───────────┤  │
│  │ JavaScript│  │  → Logic & Interactivity
│  ├───────────┤  │
│  │localStorage│  │  → Data Storage
│  └───────────┘  │
└─────────────────┘

Current (Frontend only)    →    Future (Full Stack)
         ↓                              ↓
   localStorage      →     PostgreSQL/MongoDB
   Static files      →     Node.js/Python Backend
   No auth           →     JWT/Session Auth
   Base64 images     →     Cloud Storage (S3)
   Manual deploy     →     CI/CD Pipeline
