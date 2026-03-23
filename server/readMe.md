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

# vendorFind Frontend-Backend Connection

## Overview

This project connects a **Vanilla JavaScript frontend** with a **backend API** to manage vendors and categories. The frontend allows users to:

- Search for vendors by keyword, category, and location.
- View vendor cards with name, owner, category, location, contact number, and description.
- Sign up as a vendor with a profile including category pulled from the backend.
- Login as a vendor (or admin).

The backend is assumed to have **RESTful APIs** serving JSON responses.

## Frontend Structure

- search.html — Vendor search page.
- signup.html — Vendor registration page.
- css/ — Stylesheets.
- js/ — JavaScript files:
  - server-app.js — API base setup (base URL, helper fetch functions).
  - vendors.js — Utility functions for vendor operations.
  - search-app.js — Handles searching vendors and rendering cards.
  - auth.js — Handles signup and login functionality.

## How the Frontend Connects to the Backend

### 1\. API Base URL

All API requests are made via fetch to the backend URL, defined in server-app.js:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   const API_BASE_URL = 'http://localhost:5000/api';   `

All endpoints are relative to this URL.

### 2\. Fetching Categories

The search-app.js file dynamically loads categories from the backend and populates the category field:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML

``async function loadCategories() { const res = await fetch(`${API_BASE_URL}/categories`); const categories = await res.json(); const categoryFilter = document.getElementById('categoryFilter'); categoryFilter.innerHTML = 'All Categories'; categories.forEach(cat => { categoryFilter.innerHTML += `${cat.name}`; });}``

- Endpoint: GET /api/categories
- Response: JSON array of categories with id and name.
- The dropdown updates dynamically, so new categories in the backend automatically appear on the frontend.

### 3\. Fetching Vendors

Vendors are loaded dynamically via search-app.js:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   async function loadVendors(filters = {}) {    const query = new URLSearchParams(filters).toString();    const res = await fetch(`${API_BASE_URL}/vendors?${query}`);    const vendors = await res.json();    renderVendorCards(vendors);}   ``

- Endpoint: GET /api/vendors
- Supports optional query parameters:
  - keyword — search by name or description.
  - category — filter by category ID.
  - location — filter by location text.

- Each vendor object contains a categories nested object with the category name (vendor.categories.name).

### 4\. Rendering Vendor Cards

The cards display:

- Business Name (vendor.business_name)
- Owner Name (vendor.business_owner)
- Category (vendor.categories?.name)
- Location (vendor.location)
- Contact Number (vendor.contact_number)
- Description (vendor.description)
- Link to vendor profile (vendor-profile.html?id=${vendor.id})

Example snippet:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML `### ${v.business_name}        **Category:** ${v.categories?.name || 'N/A'}        **Contact:** ${v.contact_number || 'N/A'}`

### 5\. Signup Page Connection

auth.js fetches categories from the backend dynamically for the signup form:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   async function loadSignupCategories() {    const res = await fetch(`${API_BASE_URL}/categories`);    const categories = await res.json();    const categorySelect = document.getElementById('category');    categorySelect.innerHTML = 'Select Category';    categories.forEach(cat => {        categorySelect.innerHTML += `${cat.name}`;    });}   ``

When a vendor submits the signup form:

1.  Form data is collected.
2.  Photo is converted to Base64 if uploaded.
3.  Data is sent to the backend via:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   await fetch(`${API_BASE_URL}/vendors`, {    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify(vendorData)});   ``

1.  Backend returns the created vendor object.
2.  Vendor is auto-logged in and redirected to their profile.

### 6\. Login Page Connection

The login form sends a POST request to:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   await fetch(`${API_BASE_URL}/auth/login`, {    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({ email, password })});   ``

- Backend verifies credentials.
- On success, returns the user object, which is stored in localStorage as the current user.

### 7\. Summary of API Endpoints Used

FunctionEndpointMethodNotesGet Categories/api/categoriesGETReturns list of category objectsGet Vendors/api/vendorsGETSupports keyword, category, location filtersSignup Vendor/api/vendorsPOSTCreate new vendor profileLogin Vendor/api/auth/loginPOSTAuthenticate vendor

### 8\. Local Storage

Some frontend state is kept in localStorage:

- vendorfind_current_user — logged-in vendor.
- Optional caching of vendors for offline or faster access.
