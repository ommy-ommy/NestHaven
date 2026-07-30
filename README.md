# 🏡 NestHaven - Modern Real Estate Platform

**🌐 Live Website:** [https://nest-haven-omega.vercel.app](https://nest-haven-omega.vercel.app/)

NestHaven is a full-featured, modern real estate platform designed to seamlessly connect property buyers, sellers, and real estate agents. Built with high visual appeal, responsive design, and real-time backend capabilities, NestHaven enables effortless browsing, listing management, tour scheduling, and direct buyer-seller communication.

---

## 🌟 Core Features

- **Property Search & Filtering**: Filter properties by purchase or rental category, price range, property style, location, bedrooms, and specific amenities.
- **Dynamic Property Listings**: Explore detailed listing pages featuring image galleries, specs, floor plans, neighborhood info, and amenity lists.
- **Role-Based Access Control**: Tailored portals for **Buyers**, **Sellers**, and **Administrators** with role-protected routes and dedicated dashboards.
- **Direct Messaging System**: Integrated communication portal allowing buyers and sellers to discuss property details in real time.
- **Tour Scheduling & Inquiries**: Request and schedule in-person or virtual property viewings directly from listing pages.
- **Favorites & Saved Properties**: Bookmark preferred properties for quick access and tracking on the buyer dashboard.
- **Financial Tools & Calculators**: Built-in mortgage and rental cost calculators for estimating monthly payments.
- **Admin Control Panel**: Centralized management panel for overseeing user accounts, moderating property listings, and platform metrics.

---

## 👥 User Roles & Interactions

### 🛍️ Buyer Side Interactions
- **Browse & Search Listings**: Filter sales and rental properties using multi-criteria filters (price, location, type, features).
- **Schedule Property Tours**: Request physical or virtual property viewings with custom date/time preferences.
- **Inquire & Message Sellers**: Send direct messages to property owners and listing agents regarding property inquiries.
- **Personalized Buyer Dashboard**: Manage saved favorite properties, track scheduled tours, and view message threads.
- **Calculate Payments**: Estimate monthly mortgage costs and rental budgets using interactive financial tools.

### 🏷️ Seller Side Interactions
- **Publish Property Listings**: Add property listings with title, description, pricing, location, features, and high-res image uploads.
- **Manage Listed Properties**: Edit existing property specifications, update listing statuses (*Active*, *Pending*, *Sold*), or delete listings.
- **Respond to Inquiries**: Receive and reply to direct buyer messages and tour requests in real time.
- **Seller Dashboard Analytics**: Track listing visibility, buyer interest, saved counts, and active inquiries via the seller portal.

---

## 💻 Technology Stack

### 🔤 Languages Used
- **JavaScript (ES6+)**: Powers client-side logic, custom React hooks, state management, routing, and asynchronous API integration.
- **HTML5**: Provides semantic structural elements for accessible, screen-reader friendly, and SEO-optimized Web page hierarchy.
- **CSS3**: Styled with modular custom CSS incorporating CSS variables, dynamic animations, Flexbox/Grid layouts, and responsive design systems.

### 🛠️ Frameworks, Libraries & Tools
- **React 19**: Component-driven UI library for building fast, declarative user interfaces.
- **Vite 8**: Modern, lightning-fast build tool and dev server featuring instant Hot Module Replacement (HMR).
- **React Router v7**: Declarative routing engine for Single Page Application (SPA) navigation and role-based route protection.
- **Framer Motion**: Production-ready animation library for fluid page transitions, scroll effects, and UI feedback.
- **Lucide React**: Modern icon library providing clean vector graphics across the interface.
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, user authentication, and secure cloud storage.
- **Oxlint**: Ultra-fast linting tool for keeping JavaScript and React code clean and standardized.

---

## 🚀 Deployment Guide (Vercel)

### Deploying on Vercel

NestHaven is optimized for seamless deployment on **Vercel**.

#### Step-by-Step Pointers for Vercel Deployment:
- **Repository Connection**: Push your codebase to GitHub and import the repository into your Vercel Dashboard.
- **Framework Detection**: Select **Vite** as the framework preset (Vercel usually auto-detects this).
- **Build Configurations**:
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Install Command**: `npm install`
- **Environment Variables**: Configure any environment variables needed for backend/storage integrations (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- **SPA Route Rewrites**: To ensure client-side routing with `react-router-dom` functions correctly on refreshing non-root pages, include a `vercel.json` in the root directory:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🛠️ Local Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ommy-ommy/NestHaven.git
   cd NestHaven
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License.
