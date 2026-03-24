# 🚀 VendorFind Backend API

VendorFind is a platform that connects customers with service vendors (e.g., catering, photography, transport).
This repository contains the **backend API** built with Node.js, Express, and Supabase.

---

# 📌 Project Goal

To build a scalable backend that allows:

- Vendors to register their services
- Customers to search and filter vendors
- Users to leave reviews and ratings
- Admin to monitor vendor activity

Aligned with:

- **SDG 8** – Decent Work & Economic Growth
- **SDG 9** – Industry, Innovation & Infrastructure

---

# 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **Supabase (PostgreSQL + Auth)**
- **dotenv**
- **CORS**

---

# 📁 Project Structure

```
vendorfind-backend/
│
├── src/
│   ├── config/         # Supabase configuration
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│
├── index.js            # Entry point
├── .env                # Environment variables
├── package.json
```

---

# ⚙️ Setup Instructions

## 1. Clone the Repository

```
git clone https://github.com/your-username/vendorfind-backend.git
cd vendorfind-backend
```

---

## 2. Install Dependencies

```
npm install
```

---

## 3. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Navigate to **Settings → API**
4. Copy:
   - Project URL
   - anon public key

---

## 4. Configure Environment Variables

Create a `.env` file in the root directory:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
PORT=5000
```

---

## 5. Run the Server

```
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# 🧪 API Endpoints

## 🔹 Vendors

### GET all vendors

```
GET /api/vendors
```

### POST create vendor

```
POST /api/vendors
```

Body:

```json
{
  "name": "Elite Catering",
  "description": "Best catering services",
  "category_id": "UUID",
  "location": "Nairobi",
  "contact_email": "email@example.com"
}
```

---

## 🔹 Search & Filter

```
GET /api/search?keyword=catering&location=Nairobi
```

Query Params:

- `keyword`
- `category`
- `location`

---

## 🔹 Reviews

### Add review

```
POST /api/reviews
```

```json
{
  "vendor_id": "UUID",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## 🔹 Admin

### View all vendors (with reviews)

```
GET /api/admin/vendors
```

---

# 🗄 Database Schema

## Vendors

- id (UUID)
- name
- description
- category_id
- location
- contact_email
- rating

## Categories

- id (UUID)
- name

## Reviews

- id (UUID)
- vendor_id
- rating
- comment

---

# 🌱 Default Categories

- Catering
- Photography
- Decoration
- Transport
- Cleaning
- IT Services

---

# ✅ MVP Features

- Vendor registration
- Vendor listing
- Search & filtering
- Reviews system
- Automatic rating calculation
- Admin dashboard endpoint

---

# 🧪 Testing (Postman)

Base URL:

```
http://localhost:5000/api
```

Test endpoints:

- `GET /vendors`
- `POST /vendors`
- `GET /search`
- `POST /reviews`
- `GET /admin/vendors`

---

# 🐛 Troubleshooting

## Error: supabaseUrl is required

✔ Ensure `.env` exists
✔ Check variable names are correct
✔ Add `dotenv.config()` at top of `index.js`
✔ Restart server

---

# 🚀 Deployment

- Backend: Render
- Frontend: Vercel

---

# 👨‍💻 Team Roles

- Backend Dev 1: Database + Vendors API
- Backend Dev 2: Search, Reviews, Admin API
- Frontend Devs: UI + API integration
- PM: Product coordination

---

# 📌 Future Improvements

- Authentication (Supabase Auth)
- Pagination
- Image uploads
- Vendor verification
- Caching

---

# 📄 License

MIT License

---

# 💡 Acknowledgment

Built as part of a software development bootcamp project focused on solving real-world marketplace challenges.
