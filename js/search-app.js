window.API_BASE_URL || "http://localhost:5000/api";

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  loadCategories();
  loadFromURL(); // handles initial filters
});

// =======================
// EVENT LISTENERS
// =======================
function setupEvents() {
  const searchBtn = document.getElementById("searchBtn");
  const applyFilters = document.getElementById("applyFilters");
  const keywordSearch = document.getElementById("keywordSearch");

  searchBtn?.addEventListener("click", applyFiltersHandler);
  applyFilters?.addEventListener("click", applyFiltersHandler);

  keywordSearch?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") applyFiltersHandler();
  });
}

// =======================
// LOAD CATEGORIES (FROM DB)
// =======================
async function loadCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const categories = await res.json();

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
}

// =======================
// LOAD FROM URL (ON PAGE LOAD)
// =======================
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);

  const keyword = params.get("keyword") || "";
  const category = params.get("category") || "";
  const location = params.get("location") || "";

  document.getElementById("keywordSearch").value = keyword;
  document.getElementById("categoryFilter").value = category;
  document.getElementById("locationFilter").value = location;

  loadVendors({ keyword, category, location });
}

// =======================
// APPLY FILTERS
// =======================
function applyFiltersHandler() {
  const keyword = document.getElementById("keywordSearch")?.value || "";
  const category = document.getElementById("categoryFilter")?.value || "";
  const location = document.getElementById("locationFilter")?.value || "";

  const filters = { keyword, category, location };

  updateURL(filters);
  loadVendors(filters);
}

// =======================
// UPDATE URL (NO RELOAD)
// =======================
function updateURL(filters) {
  const url = new URL(window.location);

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      url.searchParams.set(key, filters[key]);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.pushState({}, "", url);
}

// =======================
// LOAD VENDORS (API)
// =======================
async function loadVendors(filters = {}) {
  const container = document.getElementById("vendorGrid");
  if (!container) return;

  container.innerHTML = `<p>Loading vendors...</p>`;

  try {
    let url = `${API_BASE_URL}/vendors`;

    if (filters.keyword || filters.category || filters.location) {
      const params = new URLSearchParams(filters);
      url = `${API_BASE_URL}/search?${params.toString()}`;
    }

    const res = await fetch(url);
    const vendors = await res.json();

    renderVendors(vendors);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Failed to load vendors</p>`;
  }
}

// =======================
// RENDER VENDORS
// =======================
function renderVendors(vendors) {
  const container = document.getElementById("vendorGrid");

  if (!vendors || vendors.length === 0) {
    container.innerHTML = `<p>No vendors found</p>`;
    return;
  }

  console.log(`db vendors`, vendors);

  const mapped = vendors.map((v) => ({
    id: v.id,
    name: v.business_name,
    description: v.description,
    location: v.location,
    category: v.categories?.name,
    rating: v.rating || 0,
  }));

  container.innerHTML = mapped
    .map(
      (v) => `
        <div class="vendor-card" onclick="viewVendor(${v.id})">
            <h3>${v.name}</h3>
            <p>${v.description || "No description"}</p>
            <p><strong>📍</strong> ${v.location}</p>
            <p><strong>Category:</strong> ${v.category}</p>
            <p>⭐ ${v.rating}</p>
        </div>
    `,
    )
    .join("");
}

// =======================
// NAVIGATE TO PROFILE
// =======================
function viewVendor(id) {
  window.location.href = `vendor.html?id=${id}`;
}
